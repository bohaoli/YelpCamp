var mongoose = require("mongoose");

// var commentSchema = new mongoose.Schema({
//     text: String,
//     author: String
// });

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);