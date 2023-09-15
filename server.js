const app = require("./app");

const mongoose = require("mongoose");

require("dotenv").config();

const DB = process.env.DB_HOST;

const connection = mongoose.connect(DB);

connection
  .then(() => {
    app.listen(3000, () => {
      console.log(`Database connection successful`);
    });
  })
  .catch((err) => {
    console.log(`Server run failed. Error: ${err.message}`);
    process.exit(1);
  });