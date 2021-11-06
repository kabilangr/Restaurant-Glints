//dependencies import
const express = require("express")
const bodyParser = require("body-parser")

//File import
const ResturantRoute =  require("./routes/restaurant")

let app = express()

//app.use lines
app.use(bodyParser.json())
app.use("/restaurant",ResturantRoute)



app.get("/",(req,res) => {
    res.send("hello World")
});

//port listen
app.listen(process.env.PORT || 3000, () => {
    console.log("connected")
});