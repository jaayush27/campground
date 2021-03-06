var express = require("express"),
    app =  express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    Campground = require('./models/campgrounds'),
    Comment = require('./models/comment'),
    flash = require('connect-flash'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    User = require('./models/user'),
    methodOverride = require('method-override'),
    seedDB = require('./seeds');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

// creating database using mongoose
// mongoose.connect("mongodb+srv://localhost/yelpcamp");
mongoose.connect("mongodb+srv://aayush:LlBXkrnzqPLiGYy8@cluster0.bfpy5.mongodb.net/yelpcamp?retryWrites=true&w=majority");

// seedDB();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"))
app.use(methodOverride("_method"));
app.use(flash());

// passport configuration
app.use(require('express-session')({
    secret: "My name is aayush joshi",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// sets current user for every page
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

// app.listen(3000,"localhost",function(){
//     console.log("yelpcamp has started!!!");
// });
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpcamp has started!!!");
});