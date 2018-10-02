var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// var campgrounds = [
//         {name: "Salmon Creek", image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104496f8c27da3ebbdbc_340.jpg"},
//         {name: "Granite Hill", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104496f8c27da3ebbdbc_340.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104496f8c27da3ebbdbc_340.jpg"}
// ];

// Campground.create({
//     name: "Salmon Creek", 
//     image: "https://pixabay.com/get/ea36b70928f21c22d2524518b7444795ea76e5d004b014429df3c87ea5edbc_340.jpg",
//     description: "wertyuioasdfghjklxcvbnm,"
//     }, 
//     function(err, campsite){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(campsite);
//         }
//     });


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name, 
        image: image,
        description: description
    };
    Campground.create(newCampground, function(err, newSite){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

//SHOW - shows more info bout one campground
app.get("/campgrounds/:id", function(req, res){
    // var id = req.params.id;
    // Campground.find({}, function(err, allCampgrounds){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         res.render("show", {
    //             id: id,
    //             campgrounds: allCampgrounds
    //         });
    //     }
    // });
    //Also works, but we will use findById, or we have to use a for loop
    //in show.ejs
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});