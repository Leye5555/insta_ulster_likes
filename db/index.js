const mongoose = require("mongoose");

const db = async () =>
  mongoose.connect(
    "mongodb://" +
      process.env.COSMOSDB_HOST +
      ":" +
      process.env.COSMOSDB_PORT +
      "/" +
      process.env.COSMOSDB_DBNAME +
      "?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@" +
      process.env.COSMOSDB_APPNAME +
      "@",
    {
      // auth: {
      //   username: process.env.COSMOSDB_USER,
      //   password: process.env.COSMOSDB_PASSWORD,
      // },
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: false,
    }
  );
module.exports = db;
