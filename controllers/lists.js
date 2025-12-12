const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
module.exports = router;

//Root of  listing

router.get("/" , async (req, res) =>{
try{
    //Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    res.render("lists/index.ejs" , {
      lists: currentUser.lists,
    });
  }
  catch(error){
    console.error(error)
    res.redirect("/")
  }
  
});


//Create Page
router.get("/newCategory" , (req,res) =>{
   res.render("lists/category/new.ejs")
})
/*
router.get("/newCategory/newlists" , (req,res) =>{
    res.render("lists/new.ejs")
})
*/

//Add to Database
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
    currentUser.lists.push(newCategory);
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

//Find each element data
router.get("/:id" , async (req , res) =>{
  try{
    //Lock up the user from re  req.session
    const currentUser = await User.findById(req.session.user._id)
    //find the category by the categoryId from req.params
    const lists = currentUser.lists.id(req.params.id);
    //render the show view
    res.render("lists/category/show.ejs" ,{lists})
  }
  catch(error){
    console.log(error)
    res.redirect("/")
  }
})

//Delete
router.delete("/:id" , async (req , res) =>{
  try{
    //Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Use the deleteOne method for delete
    //an lists using the id from req.params
    currentUser.lists.id(req.params.id).deleteOne();
    //save change
    await currentUser.save();
    //Redirect
    res.redirect("/lists");
  }
  catch(error){
    console.error(error)
    res.redirect("/")
  }
})

//Edit Page
router.get("/:id/edit" , async(req,res) =>{
  try{
    //Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    //an lists using the id from req.params
    const list = currentUser.lists.id(req.params.id);
    // redirect
    res.render("lists/category/edit.ejs" , {list})
  }
  catch(error){
    console.error(error);
    res.redirect("/")
  }
})

//Edit data
router.put("/:id" , async (req,res) =>{
  try{
    //Find the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    //Find the current list from the id by req.params
    const list = currentUser.lists.id(req.params.id)
    //Use mangoose for set methode
    list.set(req.body);
    //save the current user
    await currentUser.save();
    //redirect
    res.redirect(`/lists/${req.params.id}`)

  }
  catch(error){
    console.error(error)
    res.redirect("/")
  }
})