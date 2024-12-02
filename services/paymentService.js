const { Payments, Status } = require('../models/payment');
const { sendMessage } = require('../telegramBot/bot');
const userService = require('./userService');
const languageService = require('./languageService');
const { User } = require('../models/user');
const settings = require('../config/settings');
const axios = require('axios');
const { References  } = require('../models/reference');
const log = require('../log')
async function createPayment(amount, currency, subPackage, coinName, userId, ref) {
  try {
    const data = {
      "price_amount": amount,
      "price_currency": "usd",
      "pay_currency": currency,
      "ipn_callback_url": "https://rawennews.com",
      "order_id": `${userId}`,
      "order_description": `UserId: ${userId} Paket fiyat: ${subPackage.price}$ Gün: ${subPackage.day} Referans: ${ref == true ? "1" : "0"}`
    };

    const response = await axios.post("https://api.nowpayments.io/v1/payment", data, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.paymentNowToken
      }
    });

    const paymentData = response.data;

    await Payments.create({
      subPackage,
      walletAdress: paymentData.pay_address,
      status: Status.PENDING,
      paymentId: paymentData.payment_id,
      coinName,
      UserId: userId,
      requiredAmount: paymentData.pay_amount.toFixed(2)
    });
    log.logMessage(`${userId} Bir ödeme oluşturdu miktar: ${amount}`)
    return paymentData;
  } catch (error) {
    console.error('Failed to create payment:', error.message);
    log.logMessage(`Error in createPayment function ${userId} ${error}`)
    return null
  }
}

async function getPaymentsByUserId(userId) {
  return await Payments.findByUserId(userId);
}

async function findById(id) {
  const payment = await Payments.findById(id)
  return await payment.dataValues
}

async function getPendingPayments() {
  return await Payments.findAll({ where: { status: Status.PENDING } });
}

async function paymentControl() {
  await new Promise(resolve => setTimeout(resolve, 5000));

  while (true) {

    try {
      const payments = await getPendingPayments();
      const currentDate = new Date();

      for (const payment of payments) {
        const user = await userService.findByUserId(payment.UserId);
        const messages = await languageService.getLanguage(user.telegramId);
        const packageData = JSON.parse(payment.subPackage);

        const diffInHours = (currentDate - new Date(payment.createdAt)) / (1000 * 60 * 60);
        
        if (diffInHours > 3) {
          await Payments.update({ status: Status.REJECT, description: "timeout"}, { where: { id: payment.id } });
          log.logMessage(`${user.id} Ödeme reddedildi`)
          continue;
        }

        const response = await axios.get(`https://api.nowpayments.io/v1/payment/${payment.paymentId}`, {
          headers: { 'x-api-key': settings.paymentNowToken }
        });

        const paymentInfo = response.data;

        if (paymentInfo.actually_paid >= packageData.price) {
          await require("../telegramBot/bot").sendMessage(user.telegramId, messages.approvedPayment);

          await Payments.update(
            { status: Status.APPROVED, sendingAmount: parseFloat(paymentInfo.actually_paid) },
            { where: { id: payment.id } }
          );

          const endDate = new Date(currentDate);
          endDate.setDate(currentDate.getDate() + packageData.day);

          await User.update(
            { subscriptionEnd: endDate, subscribe: true },
            { where: { id: user.id } }
          );

          log.logMessage(`${user.id} Ödeme onaylandı`)
          const ref = await References.findOne({where: {userId: user.id}})

          let newEndDate;
          const userPk = await User.findByPk(ref.dataValues.referanceOwner)
      
          if (userPk.subscriptionEnd) {
              newEndDate = new Date(userPk.subscriptionEnd);
              newEndDate.setDate(newEndDate.getDate() + settings.referenceDay);
          } else {
              newEndDate = new Date();
              newEndDate.setDate(newEndDate.getDate() + settings.referenceDay);
          }
      
          userPk.subscriptionEnd = newEndDate
          userPk.subscribe = true
          userPk.save()

          await References.update({dayEarned: settings.referenceDay}, {where: {id: ref.dataValues.id}})



        } else if (paymentInfo.actually_paid > 0 && paymentInfo.actually_paid < packageData.price) {
          await require("../telegramBot/bot").sendMessage(
            user.telegramId,
            messages.underPayment.replace("{id}", payment.paymentId)
          );

          await Payments.update(
            { status: Status.REJECT, sendingAmount: parseFloat(paymentInfo.actually_paid) },
            { where: { id: payment.id } }
          );

          log.logMessage(`${user.id} Ödeme reddedildi`)
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 25000));
    } catch (error) {
      console.error('Error in payment control loop:', error.message);
      log.logMessage(`Error in payment control loop: `, error)
    }
  }
}

paymentControl();

module.exports = {
  createPayment,
  getPaymentsByUserId,
  findById
};
