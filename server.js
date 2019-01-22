const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoURL = require("./config/config").mongodb.dbURI
const mongoose = require("mongoose")

const app = express()
const port = 3000

app.set("views", "./views")
app.set("view engine", "ejs")

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.promise = global.promise
mongoose.connect(mongoURL, { useNewUrlParser: true }, () => {
    console.log("successfully connected to mongodb")
})


app.get("/", (req, res) => {
    res.sendFile("index")
})

app.listen(port, () => {
    console.log(`server is listening at ${port}`)
})