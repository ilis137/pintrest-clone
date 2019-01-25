const Image = require("../models/imageModel")
const bodyParser = require("body-parser")
module.exports = (app) => {
    app.get("/profile", require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        res.send("<h1>profile</h1>")
        console.log(req.user)
            //   image.find({ "username": req.user.username }).then()
    })
    app.post("/profile", (req, res) => {

    })


}