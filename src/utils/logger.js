const { createLogger, transports, format, config } = require("winston");
// import myConfig from './config/global';
// require("winston-mongodb"); for storing logs in mongodb
// const { DB } = myConfig;

const logger = createLogger({
  levels: config.syslog.levels,
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: "instagram clone logger" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`.
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    // MongoDB transport
    // new transports.MongoDB({
    //   level: 'error',
    //   //mongo database connection link
    //   db: DB.url as string,
    //   options: {
    //     useUnifiedTopology: true,
    //   },
    //   // A collection to save json formatted logs
    //   collection: 'server_logs',
    // }),
  ],
});

exports.usersLogger = createLogger({
  levels: config.syslog.levels,
  format: format.combine(
    format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    format.align(),
    format.printf(
      (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
    )
  ),
  transports: [new transports.File({ filename: "logs/users.log" })],
});
exports.transactionLogger = createLogger({
  transports: [new transports.File({ filename: "logs/transaction.log" })],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

module.exports = logger;
