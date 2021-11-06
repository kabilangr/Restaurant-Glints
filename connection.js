//dependencies imports
const mysql = require("mysql")

//file imports
const config = require("./config.json")

//create connections
let mysqlConnection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    multipleStatements: true,
})

//connection to database
mysqlConnection.connect((err) => {
    if(!err)
    console.log("database connected")
    else
    console.log("connection failed"+err)
})

module.exports = mysqlConnection