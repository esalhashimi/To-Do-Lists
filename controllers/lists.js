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
  //render new Category Page
router.get("/newCategory" , (req,res) =>{
   res.render("lists/category/new.ejs")
})

//render new List Item by a specific category
router.get("/:id/newListItem" , async (req,res) =>{
  try{
    // Find the user
    const currentUser = await User.findById(req.session.user._id);
    // Find the specific category
    const list = currentUser.lists.id(req.params.id);
    if(!list){
      return res.status(404).send("List/Category not found");
    }
    //render
    res.render("lists/listItem/new.ejs" , {list})
  }
  catch(error){
    console.error(error)
    res.redirect("/")
  }
})


//Add to Database
 // Add data from new category page to database
router.post("/" , async(req,res) =>{
  try{
    
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
  //Add data to database
    //Add data from lists new page to database
router.post("/:id/addItem" , async(req,res) =>{
  try{
    //Find the specific category by using ID
    const listId = req.params.id;
    //find the userId
    const currentUser = await User.findById(req.session.user._id)
    
    //search from database to find id category
    const targetList = currentUser.lists.id(listId);

    if(!targetList){
      return res.status(404).send("List/Category not found");
    }

    //Add the data to database
    targetList.ListItem.push(req.body);
    //save the change
    await currentUser.save();
    //redirect
    res.redirect(`/lists/${listId}`);
  }
  catch(error){
    console.error( error);
    res.redirect("/")
  }
})



//Find each element data
  //Find each category element data
router.get("/:id" , async (req , res) =>{
  try{
    //Lock up the user from re  req.session
    const currentUser = await User.findById(req.session.user._id)
    //find the category by the categoryId from req.params
    const list = currentUser.lists.id(req.params.id);
    //render the show view
    res.render("lists/category/show.ejs" ,{list})
  }
  catch(error){
    console.log(error)
    res.redirect("/")
  }
})

  //Find each list item element data
  router.get("/:listId/items/:itemId" , async(req,res) =>{
    try{
      //Find the current user
      const currentUser = await User.findById(req.session.user._id)
      //Find specific category by using id
      const list = currentUser.lists.id(req.params.listId)

      if(!list){
        return res.status(404).send("List/Category not found")
      }

      //Find the specific list item by using id
      const listItem = list.ListItem.id(req.params.itemId)

      if(!listItem){
        return res.status(404).send("List/Category not found")
      }

      //Render
      res.render("lists/listItem/show.ejs" ,{
        list:list,
        listItem: listItem,
      })
    }
    catch(error){
      console.error(error)
      res.redirect("/")
    }
  })

//Delete
  // Delete Category
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

  //Delete Itemlist
  router.delete("/:listId/items/:itemId" , async(req,res) =>{
    try{
      //Find the current user
      const currentUser = await User.findById(req.session.user._id)
      //Find the specific category
      const list = currentUser.lists.id(req.params.listId)
      if(!list){
        return res.status(404).send("List/Category not found");
      }

      //Find and delete specific listItem by id
      list.ListItem.id(req.params.itemId).deleteOne();
      //save change
      await currentUser.save();
      //redirect
      res.redirect(`/lists/${req.params.listId}`);
    }
    catch(error){
      console.error(error)
      res.redirect("/")
    }
  })

//Edit Page
  //ُEdit the Category Page
router.get("/:id/edit" , async(req,res) =>{
  try{
    //Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    //an lists using the id from req.params
    const list = currentUser.lists.id(req.params.id);

    if(!list){
      return res.status(404).send("Category not found or invalid ID");
    }

    // redirect
    res.render("lists/category/edit.ejs" , {list})
  }
  catch(error){
    console.error(error);
    res.redirect("/")
  }
})

//Edit the ItemList Page
router.get("/:listId/items/:itemId/edit" , async(req, res)=>{
try{
// search current user
const currentUser = await User.findById(req.session.user._id)
//search specific category
const list = currentUser.lists.id(req.params.listId);

if(!list){
      return res.status(404).send("Category not found");
    }

    const listItem = list.ListItem.id(req.params.itemId);

if(!listItem){
      return res.status(404).send("List Item not found");
    }

//render
res.render("lists/listItem/edit.ejs" , { list, listItem })
}
catch(error){
  console.error(error);
  res.redirect("/")
}
})

//Edit data
  //Edit category data 
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

  //Edit ItemList data
  router.put("/:listId/items/:itemId" , async(req,res)=>{
    try{
      //search current user
      const currentUser = await User.findById(req.session.user._id);
      //search the specific categogy
      const list = currentUser.lists.id(req.params.listId)

      if(!list){
        return res.status(404).send("Category not found");
      }

      const listItem = list.ListItem.id(req.params.itemId); // استخدام itemId

      if(!listItem){
       return res.status(404).send("List Item not found");
      }

      //use set method for update the data
      listItem.set(req.body);
      //save change
      await currentUser.save()
      //redirect
      res.redirect(`/lists/${req.params.listId}/items/${req.params.itemId}`)
    }
    catch(error){
      console.error(error)
      res.redirect("/")
    }
  })