require('dotenv').config();
const axios = require('axios');
const log = require('./log')
const OPENAI_API_KEY = "";

async function translateSummarize(text) {
    try {

        const translationResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o",
                messages: [
                    { role: "user", content: `Bu haberi Türkçeye çevir ve en net ve kısa biçimde yaz ${text}` }
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return translationResponse.data.choices[0].message.content.trim();;

    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        log.logMessage(`Error in ai: ${error}`)
        return { translatedAndSummarizedText: null, impact: null };
    }
}


async function newsCommenting(text) {
    try {

        const impactResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o",
                messages: [
                    { "role": "system", "content": "You are a helpful assistant in determining whether a cryptocurrency-related news story has a positive (long) or negative (short) impact." },
                    { "role": "user", "content": `Bu haber kripto piyasasında long mu short mu? Haber: ${text}` }
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const impact = impactResponse.data.choices[0].message.content.trim();

        if (impact.toLowerCase().includes("long")) {
            return "Olumlu Haber ✅";
        } else if (impact.toLowerCase().includes("short")) {
            return "Olumsuz Haber ⛔" ;
        } else {
            return "Belirsiz";
        }


    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        log.logMessage(`Error in ai comment: ${error}`)
        return { translatedAndSummarizedText: null, impact: null };
    }
}

module.exports = {
    translateSummarize,
    newsCommenting
}

