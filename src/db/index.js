const mongoose = require("mongoose");
const environment = process.env.NODE_ENV || "development";
const db = async () => {
  mongoose.connect(
    environment === "Production"
      ? "mongodb://" +
          process.env.COSMOSDB_HOST +
          ":" +
          process.env.COSMOSDB_PORT +
          "/" +
          process.env.COSMOSDB_DBNAME +
          "?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@" +
          process.env.COSMOSDB_APPNAME +
          "@"
      : process.env.MONGO_DB_ATLAS,
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
  console.log("Database connected");
};
module.exports = db;
