//dependencies import
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

//File import
const ResturantRoute =  require("./routes/restaurant")
const Login = require("./routes/login")
const signup = require("./routes/signup")

let app = express()

//app.use lines
app.use(cors())
app.use(bodyParser.json())
app.use("/restaurant",ResturantRoute)
app.use("/login",Login)
app.use("/signup",signup)



app.get("/",(req,res) => {
    res.send("hello World")
});

//port listen
app.listen(process.env.PORT || 3000, () => {
    console.log("connected")
});