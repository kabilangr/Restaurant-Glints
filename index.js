const express = require("express");
const app = express();
const port = 3000;

app.get("/",(req,res) => {
    res.send("hellow World");
});

app.listen(process.env.PORT || port, () => {
    console.log("connected");
});