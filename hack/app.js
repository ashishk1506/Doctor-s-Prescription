const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://Admin_deepshikha:shikha123@cluster0.oaxax.mongodb.net/doctorDB", {useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false });

const doctorsSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Speciality: {
    type: String,
    required: true,
  },
  
});

const patientsschema = new mongoose.Schema({
  PName: {
    type: String,
    required: true,
  },
  PPhone: {
    type: String,
    required: true,
  },
  Ppdf:
  {
    type: String,
    required: true,
  },
  user: 
  {
    type: Schema.ObjectId, ref: 'doctors'
  }
  
});

const Doctor = mongoose.model("Doctor", doctorsSchema);





let port = process.env.PORT;
if(port == null || port == "")
{
    port=3000;
}

 app.listen(port, function(){
     console.log("server is running");
 });