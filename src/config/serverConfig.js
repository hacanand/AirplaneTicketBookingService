const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  DB: process.env.DB,
  FLIGHT_SERVICE_PATH: process.env.FLIGHT_SERVICE_PATH,
};
