const mongoose = require('mongoose');

// Embeded Docs

const ListItemScema = mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  notes:{
    type: String,
    required: true,
  },
  date:{
    type: String,
  },
  time:{
    type:String,
  },
  status:{
    type:String,
    enum: ["Upcoming" , "Current" , "Completed"],
    required: true,
  }
});

const ListScema = mongoose.Schema({
title: {
  type:String,
required: true,
},
ListItem: [ListItemScema],
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  lists:[ListScema],
});
// then we register the model with mongoose
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;
