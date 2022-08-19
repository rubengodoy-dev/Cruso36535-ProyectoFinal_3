const winston = require('winston')
const { combine, timestamp, json } = winston.format;

const createLogger = () => {

    return winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: combine(timestamp(), json()),
        transports: [
            new winston.transports.Console({level: "info"}),
            new winston.transports.File({ filename: './warn.log', level: "warn" }),
            new winston.transports.File({ filename: './error.log', level: "error" })
        ]
    })

}
module.exports = { createLogger }

