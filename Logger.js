"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require('winston');
const fs = require('fs');
const moment = require('moment');
const env = process.env.NODE_ENV || 'localhost';
const logDir = 'log';
var logFile = `${moment().format('YYYY-MM-DD').trim()}.log`;

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: `${logDir}/${logFile}`,
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
     )
    })
  ]
});

if (env !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
        ),
        level: 'info',
        timestamp: tsFormat,
        colorize: true
    }));
}

exports.NodeLogger = logger;