const { createTransport } = require('nodemailer')
const Handlebars = require('handlebars')
const path = require('path')
const { fileURLToPath } = require('url')
const { promises: fs } = require('fs')
const { createLogger } = require('../utils/logger')
const logger = createLogger()

const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

const enviarMail = async (to, subject, html) => {
    try {
        const mailOptions = {
            to,
            subject,
            html
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
        logger.error(error.message)
    }
}

const enviarMailAdministrador = async (type, subject, data) => {
    try {
        
        let templateFile, templateContent;

        if (type === 'nuevoRegistro') {
            templateFile = "../views/userNew.hbs";
            templateContent = { data };
        }

        if (type === 'nuevoPedido') {
            templateFile = "../views/orderNew.hbs";
            const {nombre,username} = data.user;
            const totalCarrito = data.productos.map(item => item.precio).reduce((prev, next) => prev + next);
            templateContent = {user:{nombre,username},productos:data.productos,totalCarrito};
        }
        let rutaAltemplate = path.join(__dirname, templateFile)
        logger.info("Ruta al template: " + rutaAltemplate)
        const emailTemplateSource = await fs.readFile(rutaAltemplate, "utf8")
        const template = Handlebars.compile(emailTemplateSource);
        const htmlMessage = template(templateContent);

        await enviarMail(process.env.ADMIN_EMAIL, subject, htmlMessage);
    } catch (error) {
        logger.error(error.message)
    }
}


module.exports = { enviarMailAdministrador }  
