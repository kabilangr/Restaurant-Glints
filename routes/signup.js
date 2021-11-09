//dependencies import
const express = require("express")
const Router = express.Router()

//mysql connection dependencies
const mysqlConnection = require("../connection")

Router.post("/",(req,res)=> {
    let SQL = "INSERT INTO userLogin ( `email`, `password`, `user_name`) VALUES (?, ?, ?);"
    mysqlConnection.query(`select * from userLogin where email="${req.body.email}";`, (err,rows,fields)=> {
        if(!err) {
            if(rows.length === 0){
                mysqlConnection.query(SQL,[req.body.email,req.body.password,req.body.userName], (err,rows,fields)=> {
                    if(!err){
                        res.send({
                            code: 200,
                            id: rows.insertId,
                            userName: req.body.userName,
                            successfull: true
                        })
                        console.log("updated successfully")
                    }
                    else {
                        res.send({message:JSON.stringify(err)})
                        console.log(err)
                    }
                })
            }
            else {
                res.send({
                    code: 400,
                    message: "Already Registered!",
                })
            }
        }
        else {
            res.send({message:JSON.stringify(err)})
            console.log(err)
        }
    })
})

module.exports = Router