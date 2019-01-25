const Image = require("../models/imageModel")
const bodyParser = require("body-parser")
module.exports = (app) => {
    app.get("/profile", require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        //res.send("<h1>profile</h1>")
        // /console.log(req.user)
        Image.find({ "username": req.user.username }).then(images => {
            res.render("index", {
                images: images,
                user: req.user
            })
        }).catch(err =>
            throw (err))
    })
    app.post("/profile", (req, res) => {
        const newImage = new Image({
            user: req.user.username,

        })
    })
    app.delete("/profile/:id", (req, res) => {
        Image.findByIdAndRemove(req.params.id).then(() => {
            res.redirect("/index")
        }).catch(err => {
            throw (err)
        })
    })

    app.post("/like", (req, res) => {
        Image.findById(req.body.id).then((elem) => {
            if (elem.likedBy.includes(req.user.username)) {
                Image.findByIdAndUpdate(req.body.id, { $inc: { "likes": 1 }, $push: { "likedBy": req.user.username } }, { new: true }).then(() => {
                    res.redirect('/index');
                }).catch(err => {
                    throw (err)
                })
            } else {
                Image.findByIdAndUpdate(req.body.id, { $inc: { "likes": -1 }, $pull: { "likedBy": req.user.username } }, { new: true }).then(() => {
                    res.redirect('/index');
                }).catch(err => {
                    throw (err)
                })
            }

        }).catch(err => { throw (err) })

    })
    app.post("/save", (req, res) => {
        // Image.findById(req.body.id).then((originalImage) => {

        // }).catch(err => { throw (err) })
    })
}