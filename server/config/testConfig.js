const fs = require("fs")
const toml = require("toml")

const Config = toml.parse(fs.readFileSync("./conf/test.toml"))

module.exports = Config