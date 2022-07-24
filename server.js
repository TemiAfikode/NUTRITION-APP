const dotenv = require("dotenv");
const app = require("./server/config/app-config");

dotenv.config();

const port = process.env.PORT || 2000;

app.listen(port);
console.log("Successfully connected to port " + port);

module.exports = app;
