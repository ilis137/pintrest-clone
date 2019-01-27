const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const morgan = require("morgan")
const twitterStrategy = require("passport-twitter").Strategy
const passport = require("passport")
const cors = require("cors")

const Image = require("./models/imageModel")
const apiController = require("./controller/apiController")
const twitterKeys = require("./config/config").TwitterKeys
const mongoURL = require("./config/config").mongodb.dbURI


const app = express()
const port = process.env.PORT || 3000


app.set("views", "./views")
app.set("view engine", "ejs")

passport.use(new twitterStrategy({
    consumerKey: twitterKeys.consumer_key,
    consumerSecret: twitterKeys.consumer_secret,
    callbackURL: "https://quiet-scrubland-22973.herokuapp.com/login/auth/twitter/callback"
}, (token, tokenSecret, profile, done) => {
    return done(null, profile)
}))

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});


app.use(require('express-session')({ secret: "hsdfgmsh234sd", resave: true, saveUninitialized: true, maxAge: 24 * 60 * 1000 }));
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
    Image.find({}).then(images => {
        res.render("home", {
            images: images,
            user: req.user
        })
    }).catch(err => { throw (err) })

})

app.get("/login/auth/twitter", passport.authenticate('twitter'))

app.get("/login/auth/twitter/callback", passport.authenticate('twitter', { successRedirect: "/profile", failureRedirect: '/login' }))

app.get("/login", (req, res) => {
    res.sendFile("login")
})
app.listen(port, () => {
    console.log(`server is listening at ${port}`)
})