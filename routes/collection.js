//dependencies import
const express = require("express")
const Router = express.Router()

//mysql connection dependencies
const mysqlConnection = require("../connection")

//get api for getting collection list
Router.get("/",(req,res)=> {
    let SQL
    if(req.body.id) //get collection based on user id
        SQL = `select * from collections where iduser="${req.body.id}";`
    else 
        SQL = `select * from collections;`
    mysqlConnection.query(SQL, (err,rows,fields)=> {
        if(!err) {
            res.send({
                code: 200,
                collection_name: rows
            })
        } else {
            res.send({
                message:JSON.stringify(err),
                code: 400,
            })
            console.log(err)
        }
    })
})

//post api for creating new collection
Router.post("/create",(req,res)=> {
    const SQL1 = `select * from userLogin where iduserLogin="${req.body.id}";`
    const SQL2 = `select * from collections where iduser="${req.body.id}" AND name="${req.body.name}";`
    const SQL3 = "INSERT INTO collections ( `name`, `iduser`) VALUES (?, ?);"
    //check if user id exist
    mysqlConnection.query(SQL1, (err,rows,fields)=> {
        if(!err) {
            if(rows.length === 1) {
                //check if the name and userid exist already
                mysqlConnection.query(SQL2, (err,rows,fields)=> {
                    if(!err) {
                        if(rows.length === 0) {
                            //add collection name to the DB
                            mysqlConnection.query(SQL3, [req.body.name, req.body.id], (err,rows,fields) => {
                                if(!err)
                                {
                                    res.send({
                                        code: 200,
                                        successful: true
                                    })
                                } else {
                                    res.send({message:JSON.stringify(err)})
                                    console.log(err)
                                }
                            })
                        } else {
                            res.send({
                                message:"Already there!",
                                code: 406,
                                successful: false,
                            })
                            console.log(err)
                        }
                    } else {
                        res.send({
                            message:JSON.stringify(err),
                            code: 400,
                        })
                        console.log(err)
                    }
                })
            } else {
                res.send({
                    message: `User does not exist`,
                    code: 406,
                    successful: false,
                })
            }
        } else {
            res.send({
                message:JSON.stringify(err),
                code: 404
            })
            console.log(err)
        }
    })
})




module.exports = Router