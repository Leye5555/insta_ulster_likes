const express = require("express");
const router = require("./routes");
const db = require("./db");
const cors = require("cors");
const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// db()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("failed to connect", err);
//   });
