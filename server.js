const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const morgan = require("morgan")
const twitterStatergy = require("passport-twitter").Statergy


const apiController = require("./controller/apiController")
const twitterKeys = require("./config/config").twitterKeys
const mongoURL = require("./config/config").mongodb.dbURI


const app = express()
const port = process.env.PORT || 3000


app.set("views", "./views")
app.set("view engine", "ejs")

passport.use(new twitterStatergy({
    consumerKey: twitterKeys.consumer_key
    consumerSecret: twitterKeys.consumer_secret
    callbackURL: "https://quiet-scrubland-22973.herokuapp.com/login/auth/twitter/callback"
}))

app.use(cors())
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan("combined"))

app.use(passport.initialize());
app.use(passport.session());


mongoose.promise = global.promise
mongoose.connect(mongoURL, { useNewUrlParser: true }, () => {
    console.log("successfully connected to mongodb")
})

apiController(app)
app.get("/", (req, res) => {
    res.render("login")
})

app.get("/login/auth/twitter", passport.authenticate('twitter'))

app.get("/login/auth/twitter/callback", passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
    res.redirect("/profile")
})
app.listen(port, () => {
    console.log(`server is listening at ${port}`)
})