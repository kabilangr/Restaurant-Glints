//dependencies import
const express = require("express")
const Router = express.Router()

//mysql connection dependencies
const mysqlConnection = require("../connection")

const days = ["Mon", "Tues", "Weds", "Thu", "Fri", "Sat", "Sun"]

function daysFetch(timeslot) {
    let data,time
    let dayArray=[]
    let daysFetched ={}
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
        dayArray ={
            "Monday": daysFetched[days[0]]? daysFetched[days[0]]: "",
            "Tuesday": daysFetched[days[1]]? daysFetched[days[1]]: "",
            "Wednesday": daysFetched[days[2]]? daysFetched[days[2]]: "",
            "Thursday": daysFetched[days[3]]? daysFetched[days[3]]: "",
            "Friday": daysFetched[days[4]]? daysFetched[days[4]]: "",
            "Saturday": daysFetched[days[5]]? daysFetched[days[5]]: "",
            "Sunday": daysFetched[days[6]]? daysFetched[days[6]]: "",
        }
        // console.log(daysFetched)
        // console.log(data)
        // console.log(value)
    })
    return dayArray
}
//get functions
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