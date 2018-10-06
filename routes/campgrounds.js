var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", 
            {
                campgrounds: allCampgrounds
            });
        }
    });
});

//CREATE - add new campground to DB
router.post("/", isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: name, 
        image: image,
        description: description,
        author: author
    };
    Campground.create(newCampground, function(err, newSite){
        if(err){
            console.log(err);
        }else{
            // console.log(newSite);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info bout one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", 
            {
                campground: foundCampground
            });
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy campground route
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
     //is user logged  in?
    if(req.isAuthenticated()){
       Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        }); 
    }else{
        res.redirect("back");
    }
}
module.exports = router;