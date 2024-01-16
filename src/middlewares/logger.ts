import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const transportError = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
});

const transportLogger = new winston.transports.DailyRotateFile({
  filename: 'request-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
});

const requestLogger = expressWinston.logger({
  transports: [
    transportLogger,
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    transportError,
  ],
  format: winston.format.json(),
});

export {
  errorLogger,
  requestLogger,
};
