const fs = require("fs")
const toml = require("toml")

const Config = toml.parse(fs.readFileSync("./conf/default.toml"))

module.exports = Config