const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
module.exports = router;

//Root of  listing

router.get("/" , (req, res) =>{
  try {
    res.render('lists/index.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


// for create List page
router.get("/newCategory" , (req,res) =>{
   res.render("lists/category/new.ejs")
})
/*
router.get("/newCategory/newlists" , (req,res) =>{
    res.render("lists/new.ejs")
})
*/

//for add list to Database
router.post("/" , async(req,res) =>{
  try{
    // build variable newCategory
    const newCategory = {
      title: req.body.title,
      ListItem: [],
    }
    //find the userId
    const currentUser = await User.findById(req.session.user._id)
    //push req.body
    //lists arrays from current user
    currentUser.lists.push(req.body);
    //save change of the current user
    await currentUser.save();
    //Redirect back to the lists index view
    res.redirect("/lists");
  }
  catch(error){
    console.error(error)
    res.redirect("/")
  }
})
/*
router.post("/newCategory" , async(req,res) =>{
  try{
    //find the userId
    const currentUser = await User.findById(req.session.user._id)
  }
  catch(error){
    console.error(error)
    res.redirect("/")
  }
})
  */