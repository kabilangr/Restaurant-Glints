//dependencies import
const express = require("express")
const Router = express.Router()

//mysql connection dependencies
const mysqlConnection = require("../connection")

//get functions
Router.get("/",(req,res)=> {
    mysqlConnection.query("select * from restaurant", (err,rows,fields)=> {
        if(!err) {
            res.send(rows)
        }
        else {
            console.log(err)
        }
    })
})

Router.post("/",(req,res) =>{
    let SQL = "INSERT INTO restaurant ( `name`, `timings`) VALUES (?, ?);"
    mysqlConnection.query(SQL,[req.body.name,req.body.timings],(err,row,fields) => {
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