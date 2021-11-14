//dependencies import
const express = require("express")
const { includes } = require("lodash")
const Router = express.Router()
var moment = require('moment')

//mysql connection dependencies
const mysqlConnection = require("../connection")

const days = ["Mon", "Tues", "Weds", "Thu", "Fri", "Sat", "Sun"]

function daysFetch(timeslot, dayName,givenTime) {
    let data,time
    let dayArray=[]
    let daysFetched ={}
    let finalDate=[]
    timeslot.forEach(value => {
        data= value.split(",")
        if(!data[data.length-1].substring(0,4).includes("-")) {
            time = data[data.length-1].split(" ").filter(arr => arr)
            time.shift()
            time = time.join(" ")
        }
        else {
            time = data[data.length-1].split(" ").filter(arr => arr)
            time.shift()
            time = time.join(" ")
        }
        data.forEach((day) => {
            if(day.split(" ").filter(arr => arr)[0].includes("-"))
            {
                // daysFetched[day.split(" ",1)[0]]= time
                let init = days.findIndex((find) => find === day.split(" ").filter(arr => arr)[0].split("-").filter(arr => arr)[0]) 
                let final = days.findIndex((find) => find === day.split("-")[1].split(" ").filter(arr => arr)[0])
                for(var i=0;i<days.length;i++)
                {
                    if(i>=init && i<= final)
                    daysFetched[days[i]] = time
                }
            }
            else {
                let dayKey = day.split(" ").filter(arr => arr)[0]
                daysFetched[dayKey] = time
            }
        })
    })
    for(var i=0;i<=6;i++) {
        console.log("here is ", days[i],daysFetched[days[i]])
        let fetched = daysFetched[days[i]]
        const startDate = fetched && moment(moment(fetched.split("-")[0],["h : mm A"]).format("HH:mm"),["HH:mm"])
        const endDate = fetched && moment(moment(fetched.split("-")[1],daysFetched[days[i]].split("-")[1].toString().includes(":")?["h : mm A"]:["h A"]).format("HH:mm"),["HH:mm"])
        const date = moment(moment(givenTime,["HH:mm"]).format("HH:mm"),["HH:mm"])
        if(dayName == "All" && fetched) {
            if(date.isBefore(endDate) && date.isAfter(startDate)) {
                finalDate.push(fetched)
            } else if(givenTime === null) {
                finalDate.push(fetched)
            } else {
                finalDate.push(null)
            }
        } else if(dayName == days[i] && fetched) {
            if(date.isBefore(endDate) && date.isAfter(startDate)) {
                finalDate.push(fetched)
            } else {
                finalDate.push(null)
            }
        }
        else {
            finalDate.push(null)
        }
    }
    dayArray ={
        "Monday": finalDate[0]? finalDate[0]: daysFetched[days[0]],
        "Tuesday": finalDate[1]? finalDate[1]: daysFetched[days[1]],
        "Wednesday": finalDate[2]? finalDate[2]: daysFetched[days[2]],
        "Thursday": finalDate[3]? finalDate[3]: daysFetched[days[3]],
        "Friday": finalDate[4]? finalDate[4]: daysFetched[days[4]],
        "Saturday": finalDate[5]? finalDate[5]: daysFetched[days[5]],
        "Sunday": finalDate[6]? finalDate[6]: daysFetched[days[6]],
        "timeline": timeslot? timeslot: "",
    }
    return dayArray
}

//get functions to fetch all restaurant
Router.get("/",(req,res)=> {
    mysqlConnection.query("select * from restaurant", (err,rows,fields)=> {
        let data=[]
        if(!err) {
            rows.forEach(element => {
                timeslot=element.timings.split("/")
                let value = {
                    name: element.name,
                    timeline: daysFetch(timeslot)
                }
                data.push(value)
            });
            // console.log(data)
            res.send(data)
        }
        else {
            console.log(err)
        }
    })
})

//get method to fetch search 
Router.get("/search",(req,res) => {
    const search = req.query.search
    const day = req.query.day
    const time = req.query.time==="null"? null: req.query.time
    console.log("helloooooooo",search,day,time)
    const SQL = `select * from restaurant WHERE name LIKE '%${search}%'`
    console.log("helloooooooo",search,day,time)
    mysqlConnection.query(SQL, (err,rows,fields) => {
        let data=[]
        if(!err) {
            rows.forEach(element => {
                timeslot=element.timings.split("/")
                let value = {
                    name: element.name,
                    timeline: daysFetch(timeslot, day,time)
                }
                data.push(value)
            });
            console.log(data)
            res.send(data)
        }
        else {
            console.log(err)
        }
    })
    console.log(req.params.search)
})

//post method to add restaurant 
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