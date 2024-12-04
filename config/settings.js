const settings = {

    channel: "https://t.me/Rawenews",
    supportChannel: "https://t.me/rawensupport",

    ownerIds: ["1081750776", "2058169613"],

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


    referenceDay : 5,
    sourceChannels: [],
   
    replacedKeyword: [
        "Tree News:", "BWENEWS AUTO:", "*GEMINI", "GEMINI", "BWENEWS:", 
        "𝐙𝐚𝐫𝐠𝐚𝐧𝐚 𝐍𝐞𝐰𝐬 AUTO:", "Zargana News", "𝐙𝐚𝐫𝐠𝐚𝐧𝐚 𝐍𝐞𝐰𝐬", 
        "kaynak:", "source:", "[TREE DAO]", "BWENEWS", "AggrNews"
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