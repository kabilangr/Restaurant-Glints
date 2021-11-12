//dependencies import
const express = require("express")
const Router = express.Router()

//mysql connection dependencies
const mysqlConnection = require("../connection")

//get all list based on the user
Router.post("/",(req,res) => {
    const SQL = `SELECT * FROM collections LEFT JOIN collection_list ON  idCollection=id_collection Where iduser=${req.body.id};` 
    mysqlConnection.query(SQL,(err,rows,fields) => {
        if(!err) {
            if(rows.length > 0) {
                let data ={}
                rows.forEach((row,index) => {
                    data[row.name]=[]
                })
                rows.forEach((row,index) => {
                    if(row.idcollection_list)
                        data[row.name].push({
                            id: row.idcollection_list,
                            restaurant: row.restaurant,
                            timing: row.timing,
                        })
                })
                res.send({
                    code: 200,
                    collection: data,
                    successful: true,
                })
                console.log(JSON.stringify(data));
            } else {
                res.send({
                    code: 200,
                    collection: rows
                })
            }
        } else {
            res.send({
                message:JSON.stringify(err),
                code: 400,
            })
            console.log(err)
        }
    })
})

//post api to add the timing to list
Router.post("/add",(req,res) => {
    const SQL1 = `SELECT * FROM collections WHERE idCollection=${req.body.id};`
    const SQL2 = `SELECT * FROM collection_list WHERE id_collection=${req.body.id} AND restaurant="${req.body.restaurant}" ;`
    const SQL3 = "INSERT INTO collection_list (`id_collection`, `restaurant`, `timing`) VALUES (?, ?, ?);"
    mysqlConnection.query(SQL1,(err,rows,fields) => {
        if(!err) {
            if(rows.length === 1) {
                mysqlConnection.query(SQL2, (err,rows,fields) => {
                    if(!err) {
                        if(rows.length === 0) {
                            mysqlConnection.query(SQL3,
                                [req.body.id, req.body.restaurant, req.body.timing], (err,rows,fields) => {
                                    if(!err) {
                                        res.send({
                                            code: 200,
                                            successful: true
                                        })
                                    }
                                    else {
                                        res.send({message:JSON.stringify(err)})
                                        console.log(err)
                                    }
                                })
                        }
                        else {
                            res.send({
                                code: 406,
                                message:"Already there!",
                                successful: false
                            })
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
                    message: "Collection does not exist",
                    code: 406,
                })
            }
        } else {
            res.send({
                message:JSON.stringify(err),
                code: 400,
            })
            console.log(err)
        }
    })
})

module.exports = Router