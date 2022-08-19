const { createLogger } = require('../utils/logger')
const logger = createLogger()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);


const enviarSmsUsuario = async (subject, toMessage) =>{

client.messages
    .create({
        body: subject,
        to:toMessage,
        from: process.env.TWILIO_FROM_NUMBER,
    })
    .then((message) => logger.info(message.sid, message.status));

}

    module.exports = { enviarSmsUsuario }  