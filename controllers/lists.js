const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
module.exports = router;

//index for listing

router.get("/" , (req, res) =>{
  try {
    res.render('lists/index.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get("/new" , (req,res) =>{
    res.render("lists/new.ejs")
})