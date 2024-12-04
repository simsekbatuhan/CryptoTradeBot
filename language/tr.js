
const tr = {
    language: "TR",
    cancel: "İptal",
    canceled: "İşlem iptal edildi.",

    address: "Adres",
    date: "Tarih",

    success0001: "Dil ayarı başarıyla güncellendi.",
    success0002: "Çekim talebiniz başarıyla alındı.",
    success0003: "Txid bilgisi alındı.",
    success0004: "Kullanıcı referansına katıldınız.",
    success0005: "Borsa verileriniz başarıyla kaydedildi.",

    approved: "Onaylandı.",
    reject: "Reddedildi.",
    pending: "Bekliyor.",

    working: "🟢 Çalışıyor",
    care: "🟡 Bakımda",
    notWorking: "🔴 Çalışmıyor",

    button_sup: "🆘 Destek",
    button_account: "👤 Hesabım",
    button_fqa: "ℹ SSS",
    button_channel: "📰 Telegram Kanalı",
    button_back: "Geri Git",
    button_check: "Kontrol Et",
    button_txid: "Txid Girişi Yap (Zorunlu)",
    button_sub: "Abonelik",
    button_market: "Borsa",
    button_myPayments: "Ödemelerim",
    button_reference: "Referans",
    button_joinedMyReference: "Referansıma katılanlar",
    button_nextStep: "Sonraki Adım",
    button_previousStep: "Önceki Adım",
    button_enterMarketkeys: "🗒️ Bilgileri Gir 🗒️",
    button_selectMarket: "Borsalar",
    button_editButtons: "Buton Ayarları",
    button_long: "LONG",
    button_short: "SHORT",
    button_symbols: "SEMBOLLER",
    button_closeOrder: "İşlemi Kapat",
    button_selectLang: "Dil",
    button_bot: "Bot",
    button_feedBack: "Geri Bildirim",
    button_changeLog: "Güncellemeler",

    infoMarket_bybit_1: `
1. https://bybit.com adresinden hesabınıza giriş yapın
2. Hesabınıza giriş yaptıktan sonra sağ üstte bulunan profile basın  

Hesabınız yok ise https://partner.bybit.com/b/84632 buradan hesap oluşturabilirsiniz.
    `,

    infoMarket_bybit_2: `
1. API yazan kısıma tıklayın    
    `,

    infoMarket_bybit_3: `
1. Create new key'e basın    
    `,

    infoMarket_bybit_4: `
1. System generated api keys'i seçin  
    `,

    infoMarket_bybit_5: `
1. Read-write seçeneğini açın
2. Unified trading seçeneğini açın  
3. Kayıt edip doğrulamayı yapın
    `,
    infoMarket_bybit_6: `
1. Oluşacak olan api key ve api secret'i bir yere kaydedin
2. Api key ve api secret key'ini bot ile paylaşın

❗(Api key ve secret key kimse tarafından görüntülenemez, bilgileriniz şifrelenerek saklanır.)
    `,


    infoMarket_binance_1: `
1. Borsanız pro mod olarak ayarlayın.
2. Arama yerine "API" yazın.
    `,

    infoMarket_binance_2: `
1. En üstte çıkan bağlantıya tıklayın.
    `,

    infoMarket_binance_3: `
1. Create API'ye tıklayın.
    `,

    infoMarket_binance_4: `
1. System generated olanı seçin.
2. Ve Next'e tıklayın.
3. API'ye bir isim verin, vereceğiniz isim fark etmez.
4. Güvenlik adımlarını takip edin.

    `,

    infoMarket_binance_5: `
1. Edit'e tıklayın.
    `,

    infoMarket_binance_6: `
1. İşaretli olan tiki açınız (önemli).
2. Withdrawal izni açık ise kapatabilirsiniz.
3. Buradaki API key ve secret key'i bir yere saklayın.
4. Üst kısımda bulunan Save butonuna tıklayın.
5. API key ve secret key'i bot ile paylaşın.

❗(API key ve secret key kimse tarafından görüntülenemez, bilgileriniz şifrelenerek saklanır.)
    `,

    timeout: "Zaman aşımı.",
    missingAmount: "Eksik miktar.",

    error: "Bir hata oluştu.",
    error0001: "Dil ayarınız güncellenemedi.",
    error0002: "Dil ayarınız güncellenirken bir hata oluştu.",
    error0003: "Borsa verileriniz kayıt edilirken bir hata oluştu, lütfen tekrar deneyin.",

    error00013: "Daha önce bir referans linkine kayıt olmuşsunuz.",
    error00014: "Bu referans koduna kayıtlı bir kullanıcı bulunamadı.",
    error00015: "Kendi referans linkinize katılamazsınız.",

    sub1: "1 Ay",
    sub2: "3 Ay",
    sub3: "1 Yıl",

    rejectPayment: "Abonelik satın alımınız iptal edildi. Bir hata olduğunu düşünüyorsanız yetkililerle iletişime geçebilirsiniz.",
    approvedPayment: "🎉 Abonelik satın alımınız onaylandı.",
    underPayment: "Ödemeniz gereken tutarın altında ödeme yaptığınız için ödemeniz reddedildi. Ödeme ID: {id}.",
    userNotFound: "Kullanıcı bulunamadı.",
    processCancelled: "İşlem iptal edildi.",
    timeoutError: "Bir süre işlem yapmadığınız için işleminiz iptal edildi.",
    selectMarket: "Hangi borsa üzerinden işlem yapmak istiyorsunuz?",
    noSub: "Bu işlem için üyeliğinizin bulunması gerekiyor; Hesabım menüsünden üyelik hakkında bilgi alabilirsiniz.",
    subscribe: `Satın almak istediğiniz paketi seçiniz.

1 ay - 149$ 
3 ay - 349$ ( %30 indirim)
1 yıl - 999$ (%45 indirim)

{discount}
    `,
    discountMessage: "Katıldığın referansa özel {rate} indirim!",
    errorSub: "Aktif bir aboneliğiniz bulunuyor; aboneliğiniz bitmeden abonelik alamazsınız.",
    noPayment: "Hiç ödeme bulunmuyor.",
    myPayments: "Ödemeleriniz. (En fazla 10 adet gösterilir.)",
    endSub: "Aboneliğiniz sona ermiştir; dilerseniz yeni bir abonelik satın alabilirsiniz.",
    selectPaymentType: "Ödeme yapmak istediğiniz türü seçiniz.",
    myReferences: "Referansınıza katılan kullanıcıları görebilirsiniz. (En fazla 20 adet)",
    editButtons: "Düzenlemek istediğiniz butonun üstüne tıklayın ve kaç dolarlık işlem yapmak istediğinizi giriniz (short ve long butonları birbiri ile bağlantılıdır)",
    buttonSaved: "Buton kaydedildi.",
    onlyInteger: "Lütfen sadece tam sayı giriniz.",
    createdOrder: "İşlem başarıyla oluşturuldu.",
    errorCreateOrder: "İşlem oluşturulurken bir hata oluştu: {err}",
    closedOrder: "İşlem başarıyla kapatıldı.",
    errorCloseOrder: "İşlem kapatılırken bir hata oluştu: {err}",
    channelMessage: "Herkese Açık Haber Kanalımız!",
    supMessage: "Destek almak istediğiniz konuyu bize iletin.",
    notFound: "Bulunmuyor",
    available: "Bulunuyor",
    editButtonMessage: "Atamak istediğiniz pozisyon miktarı",
    binanceSideError: `Binance Vadeli İşlemler -> Ayarlar -> “Pozisyon Modu Ayarları ”nda iki yönlü pozisyon modunu (hedge) seçmeniz gerekir.`,
    paymentErr: "\nÖdeme yaptığınız zaman txid bilgisini @rawensupport ile paylaşın\n",
    feedbackMsg: "Geri bildirim/Öneri yapmak istediğiniz konuyu yazınız.",
    sendingFeedback: "Geri bildiriminiz başarıyla gönderilmiştir ilginiz için teşekkür ederiz",

    bot: `
Sürüm: {version}
Durum: {status}
`,

    market: `
Borsa: {market}
Kayıt Tarihi: {createdAt}
    `,

    paymentInfo: `
ℹ️ ID: {id}
ℹ️ Ödeme ID: {paymentId}

⚙️ Durum: {status}
📆 Oluşturulma tarihi: {createdAt}

💰 Paket Fiyatı: {packagePrice}$
⏱️ Paket Süresi: {packageDay} Gün

💰 Gönderilmesi Gereken: {requiredAmount} USDT
💸 Gönderilen: {receivedAmount} USDT

✉️ Cüzdan Adresi: {walletAddress}
🪙 Sembol: {coinName}
    `,

    deposit: `
📦 Paket satın almak için {price} {symbol} göndermeniz gerekmektedir.

❗️ Ödeme yaparken komisyon tutarını ekleyip gönderiniz! ❗️
❗️ Aksi takdirde paket alımınız gerçekleşmez! ❗️
{paymentErr}
❗️ Farklı bir ağda gönderim sağlamayın! ❗️

💵 Ücret: {price} {symbol}
⏱️ Süre: {day} Gün

\`{address}\`

(Kopyalamak için cüzdanın üzerine tıklayın.)
`,

    account: `👤 Telegram ID: {telegramId}

📆 Kayıt Tarihi: {createdAt}
🎉 Dil: {lang}

💎 Abonelik: {subscriber}
⏱️ Abonelik Bitiş: {subEndDate}

🔑 Borsa Tercihi: {market}`,

    refferalMessage: `
👥 Referans sistemi 👥
                
❗️ Davet edilen kullanıcıların her abonelik alışında +5 gün kazanın
                
❗️ Davet bağlantınız:
                
\`{link}\`
                
(Kopyalamak için bağlantıya tıklayın 👆
➖➖➖➖➖
📥 Toplam kullanıcı davet edildi: {totalInvite}
💰 Referanslardan kazanılan: {earned} Gün
Katıldığın referans: {code}
`,

sss: `
### Sık Sorulan Sorular

1. *Bu bot ne işe yarar?*  
   Bu bot, profesyonel haber trade eden kişilerin haberlere çok daha hızlı (20 saniye erkenden) erişip aksiyon almalarını sağlar.

2. *Borsaya bağlamadan haberleri takip edebilir miyim?*  
   Evet, haberler bu bot üzerinden size hızlıca iletilecektir.

3. *Borsa butonlarındaki sayılar ne anlama geliyor?*  
   Butonların üzerindeki sayılar, açacağınız pozisyon büyüklüğünün dolar bazlı miktarını belirler.

4. *Butonlar hangi kaldıraç ile işlem açıyor?*  
   Kaldıraç, kullandığınız borsa üzerindeki kaldıraç oranına göre işlem yapar (örneğin 10x ise 10x kullanır).

5. *Üyelik satın almadan referans linkim ile birini davet etsem 5 günlük üyelik yine bana tanımlanır mı?*  
   Evet, 5 günlük hediye üyelik hesabınıza tanımlanır.

6. *Hangi borsalar bağlanabiliyor?*  
   Şimdilik sadece Binance ve Bybit destekleniyor. Ancak ileride daha fazla seçenek sunulacak.

7. *Rawen özel kaynaklar nelerdir?*  
   Twitter kaynakları, çeşitli insider hesaplar ve özel araştırmalardan oluşur.
`,


}

module.exports = tr; 
