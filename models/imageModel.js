const mongoose = require("mongoose")


const ImageSchema = new mongoose.Schema({
    username: String,
    title: String,
    imageLink: String,
    likes: Number,
    likedBy: []
})

const Images = new mongoose.model("Images", ImageSchema)

module.exports = Images