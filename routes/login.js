//dependencies import
const express = require("express")
const Router = express.Router()

//mysql connection dependencies
const mysqlConnection = require("../connection")

Router.post("/",(req,res)=> {
    mysqlConnection.query(`select * from userLogin where email="${req.body.login}";`, (err,rows,fields)=> {
        if(!err){
            if(rows.length) {
                if(req.body.password === rows[0].password) {
                    res.send({
                        code: 200,
                        userName: rows[0].user_name,
                        id: rows[0].iduserLogin,
                        successfull: true
                    })
                    console.log("updated successfully")
                }
            }
            else {
                res.send({
                    code: 404,
                    successfull: false
                })
            }
        }
        else {
            res.send({
                message:JSON.stringify(err),
                code: 400,
                successfull: false
            })
            console.log(err)
        }
    })
})

module.exports = Router