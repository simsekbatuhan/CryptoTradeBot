const settings = {
    telegramToken: "",
    paymentNowToken: "",
    deeplToken: "",

    channel: "",
    supportChannel: "",

    ownerIds: ["", ""],

    discountReference: [
        {
            code: "yammm",
            rate: 10
        },
        {
            code: "4MKF1sO",
            rate: 10
        }
    ],

    apiId: 0,
    apiHash: "",
    phoneNumber: "+905541880969",
    referenceDay : 5,
    sourceChannels: ["", ""],
    
    replacedKeyword: [

    ],

    statusEmojis: {
        reject: "🔴",
        approved: "🟢",
        pending: "🟡"
    },

    paymentMethods: [

        {
            name: "USDT (BEP20)",
            coin: "usdtbsc"
        },
        {
            name: "USDT (ARBITRUM ONE)",
            coin: "usdtarb"
        }

    ],

    subPackages: [
        {
            name: "{sub1}",
            day: 30,
            packetNumber: 1,
            price: 149
        },
        {
            name: "{sub2}",
            day: 90,
            packetNumber: 2,
            price: 349
        },
        {
            name: "{sub3}",
            day: 365,
            packetNumber: 3,
            price: 999
        }
    ]
}

module.exports = settings