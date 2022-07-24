"use strict";

const connectionString =
    "mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false";

module.exports = {
    url: process.env.DATABASE_URL || "mongodb://localhost/cats-app",
};
