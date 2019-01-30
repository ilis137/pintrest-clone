const Image = require("../models/imageModel")
const bodyParser = require("body-parser")
module.exports = (app) => {
    app.get("/", (req, res) => {
        Image.find({}).then(images => {
            res.render("home", {
                images: images,
                user: req.user
            })
        }).catch(err => { throw (err) })
    })
    app.get("/profile", require('connect-ensure-login').ensureLoggedIn(), (req, res) => {

        Image.find({ "username": req.user.username }).then(images => {
            console.log(images)
            res.render("profile", {
                images: images,
                user: req.user
            })
        }).catch(err => { throw (err) })
    })
    app.post("/profile", (req, res) => {

        var newImage = Image({
            username: req.user.username,
            title: req.body.title,
            imageLink: req.body.imageLink,
            likes: 0,
            likedBy: []
        });
        newImage.save().then(() => res.redirect("/profile"))
            .catch((err) => { throw (err) })
    })

    app.delete("/profile/:id", (req, res) => {
        Image.findByIdAndRemove(req.params.id).then(() => {
            res.redirect("/profile")
        }).catch(err => {
            throw (err)
        })
    })

    app.post("/like", (req, res) => {
        console.log(req.query)
        Image.findById(req.body.id).then((elem) => {
            if (elem.likedBy.includes(req.user.username)) {

                Image.findByIdAndUpdate(req.body.id, { $inc: { "likes": 1 }, $push: { "likedBy": req.user.username } }, { new: true }).then(() => {

                    console.log(req.body.id)

                    res.redirect('/');
                }).catch(err => {
                    throw (err)
                })
            } else {
                Image.findByIdAndUpdate(req.body.id, { $inc: { "likes": -1 }, $pull: { "likedBy": req.user.username } }, { new: true }).then(() => {
                    res.redirect('/');
                }).catch(err => {
                    throw (err)
                })
            }

        }).catch(err => { throw (err) })

    })
    app.post("/save", (req, res) => {
        console.log(req.user)
        Image.findById(req.body.id).then((originalImage) => {
            var retweetImage = Image({
                username: req.user.username,
                title: originalImage.title,
                imageLink: originalImage.imageLink,
                likes: 0,
                likedBy: []
            })
            retweetImage.save().then(() => res.redirect("/")).catch(err => { throw (err) })
        }).catch(err => { throw (err) })
    })
}