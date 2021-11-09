//dependencies import
const express = require("express")
const Router = express.Router()

//mysql connection dependencies
const mysqlConnection = require("../connection")

Router.post("/",(req,res)=> {
    let SQL = "INSERT INTO restaurant ( `email`, `password`, `user_name`) VALUES (?, ?, ?);"
    mysqlConnection.query(SQL,[req.body.email,req.body.password,req.body.userName], (err,rows,fields)=> {
        if(!err){
            res.send({code: 200})
            console.log("updated successfully")
        }
        else {
            res.send({message:JSON.stringify(err)})
            console.log(err)
        }
    })
})

module.exports = Router