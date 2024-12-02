
const en = {
    language: "EN",
    cancel: "Cancel",
    canceled: "The operation was canceled.",

    address: "Address",
    date: "Date",
    
    success0001: "Language settings updated successfully.",
    success0002: "Your withdrawal request has been successfully received.",
    success0003: "Txid information received.",
    success0004: "You have joined the user's referral.",
    success0005: "Your exchange data has been successfully saved",

    approved: "Approved.",
    reject: "Rejected.",
    pending: "Pending.",

    button_sup: "🆘 Support",
    button_account: "👤 My Account",
    button_fqa: "ℹ FAQ",
    button_channel: "📰 Telegram Channel",
    button_back: "Go Back",
    button_check: "Check",
    button_txid: "Enter Txid (Required)",
    button_sub: "Subscription",
    button_market: "Exchange",
    button_myPayments: "My Payments",
    button_reference: "Referral",
    button_joinedMyReference: "Those who joined my referral", 
    button_nextStep: "Next Step",
    button_previousStep: "Previous Step", 
    button_enterMarketkeys: "🗒️ Enter Details 🗒️",
    button_selectMarket: "Exchanges",
    button_editButtons: "Button Settings",
    button_long: "LONG",
    button_short: "SHORT",
    button_symbols: "SYMBOLS",
    button_closeOrder: "Close Order",
    button_selectLang: "Language",

    infoMarket_bybit_1: `
1. Log in to your account at https://bybit.com
2. After logging in, click on the profile at the top right    

If you do not have an account, you can create an account at https://partner.bybit.com/b/84632
    `,

    infoMarket_bybit_2: `
1. Click on the section marked API    
    `,

    infoMarket_bybit_3: `
1. Click on "Create new key"    
    `,

    infoMarket_bybit_4: `
1. Choose the system generated API keys  
    `,

    infoMarket_bybit_5: `
1. Enable the read-write option
2. Enable the unified trading option  
3. Save and verify the key
    `,
    infoMarket_bybit_6: `
1. Save the generated API key and secret somewhere safe
2. Share the API key and secret key with the bot

❗(The API key and secret key cannot be viewed by anyone, they are stored encrypted.)
    `,



    infoMarket_binance_1: `
1. Set your exchange to pro mode.
2. Search for "API".

    `,

    infoMarket_binance_2: `
1. Click on the top result.
        `,

    infoMarket_binance_3: `
1. Click on Create API.
    `,

    infoMarket_binance_4: `
1. Select the system generated option.
2. Then click Next.
3. Name the API; the name doesn’t matter.
4. Complete the security steps
    `,

    infoMarket_binance_5: `
1. Click on Edit.
    `,
    
    infoMarket_binance_6: `
1. Uncheck the marked checkbox (important).
2. You can turn off withdrawal permissions.
3. Save the API key and secret key somewhere.
4. Click on the save button at the top.
5. Share the API key and secret key with the bot

❗(The API key and secret key cannot be viewed by anyone, they are stored encrypted.)
    `,


    timeout: "Timeout.",
    missingAmount: "Missing amount.",

    error: "An error occurred.",
    error0001: "Your language settings could not be updated.",
    error0002: "An error occurred while updating your language settings.",
    error0003: "An error occurred while saving your exchange data. Please try again.",
    
    error00013: "You have already registered with a referral link",
    error00014: "No user found with this referral code",
    error00014: "You cannot join your own referral link",

    sub1: "1 Month",
    sub2: "3 Months",
    sub3: "1 Year",

    rejectPayment: "Your subscription purchase has been canceled. If you think there was an issue, you can contact support.",
    approvedPayment: "🎉 Your subscription purchase has been approved.",
    underPayment: "Your payment was below the required amount. Payment ID: {id}.",
    userNotFound: "User not found.",
    processCancelled: "The operation was canceled.",
    timeoutError: "Your operation was canceled due to inactivity.",
    selectMarket: "Which exchange would you like to trade on?",
    noSub: "This operation requires a subscription; you can get more information about your subscription from the My Account menu.",
    subscribe: "Please select the package you would like to purchase.\n\n{discount}",
    discountMessage: "Special {rate} discount for your referral!",
    errorSub: "You already have an active subscription; you cannot buy another subscription until it expires.",
    noPayment: "No payment found.",
    myPayments: "Your payments. (Up to 10 displayed.)",
    endSub: "Your subscription has ended; you can purchase a new one if you like.",
    selectPaymentType: "Please select the type of payment you want to make.",
    myReferences: "You can view the users who joined your referral. (Up to 20 displayed.)",
    editButtons: "Click on the button you want to edit and enter the amount for the transaction (short and long buttons are linked)",
    buttonSaved: "Button saved",
    onlyInteger: "Please enter only an integer",
    createdOrder: "Order created successfully",
    errorCreateOrder: "An error occurred while creating the order {err}",
    closedOrder: "Order closed successfully",
    errorCloseOrder: "An error occurred while closing the order: {err}",
    channelMessage: "Our Public News Channel!",
    supMessage: "Let us know the issue you need support with", 
    notFound: "Not found",
    available: "Available",
    editButtonMessage: "the amount of position you want to assign",
    binanceSideError: `In Binance Futures -> Settings -> “Position Mode Settings” you need to select the two-way position mode (hedge).`,
    paymentErr: "\nWhen you make the payment, share the TXID information with @rawensupport\n",

    market: `
Exchange: {market}
Registration Date: {createdAt}

    `,

    paymentInfo: `
ℹ️ ID: {id}
ℹ️ Payment ID: {paymentId}

⚙️ Status: {status}
📆 Creation Date: {createdAt}

💰 Package Price: {packagePrice}$
⏱️ Package Duration: {packageDay} Days

💰 Amount to be Sent: {requiredAmount} USDT
💸 Amount Sent: {receivedAmount} USDT

✉️ Wallet Address: {walletAddress}
🪙 Symbol: {coinName}
    `,

    deposit: `
📦 To purchase the package, you need to send {price} {symbol}.

❗️ Make sure to add the commission fee when making the payment! ❗️
❗️ Otherwise, your package purchase will not be processed! ❗️
{paymentErr}
❗️ Do not send on a different network! ❗️

💵 Price: {price} {symbol}
⏱️ Duration: {day} Days

\`{address}\`

(Click on the wallet to copy it.)
`,

    account: `👤 Telegram ID: {telegramId}

📆 Registration Date: {createdAt}
🎉 Language: {lang}

💎 Subscription: {subscriber}
⏱️ Subscription End: {subEndDate}

🔑 Exchange Preference: {market}`,

refferalMessage: `
👥 Referral System 👥
                
❗️ Get +5 days for each subscription purchase by the invited users.
                
❗️ Your invitation link:
                
\`{link}\`
                
(Click the link to copy 👆)
                            
➖➖➖➖➖
📥 Total users invited: {totalInvite}
💰 Earnings from referrals: {earned} Days
Your referral code: {code}`,

sss: `
### Frequently Asked Questions

1. *What is the purpose of this bot?*  
   This bot allows professional news traders to access news 20 seconds earlier and take action accordingly.

2. *Can I follow the news without connecting to an exchange?*  
   Yes, the news will be delivered to you quickly through this bot.

3. *What do the numbers on the exchange buttons mean?*  
   The numbers on the buttons determine the size of the position you will open in dollar terms.

4. *What leverage do the buttons use?*  
   The leverage is based on the leverage set on your connected exchange (e.g., if 10x, then 10x is used).

5. *If I invite someone using my referral link without purchasing a membership, will I still receive a 5-day membership?*  
   Yes, a 5-day free membership will be credited to your account.

6. *Which exchanges can be connected?*  
   Currently, only Binance and Bybit are supported. More options will be available in the future.

7. *What are Rawen's special sources?*  
   Twitter sources, various insider accounts, and in-depth research.

`,
}

module.exports = en;
