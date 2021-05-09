const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
require('dotenv').config()
const mailer = require('./module/mailer')
const dbConn = require('./config/dbConfig')
const pdf = require("pdf-creator-node");
const host = '0.0.0.0'
const PORT = process.env.PORT

const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const fs = require("fs");

const _ = require("lodash")
const user = require('./db/user')
app.use(cors())
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

let data = null
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.get('/',(req,res)=>{
  res.render('index')
})

app.post('/prescription/',(req,res)=>{
 data = req.body
 try{
    dbConn.query("INSERT INTO patient (pName,pNumber,pEmail,dName,link) VALUES (?,?,?,?,?)",
    [data.patient_name, data.patient_phone, data.patient_email, data.doctor_name, ''],(err,result)=>{
    if(err)
    console.log(err)
    else{
      console.log("done",result)
    }
 })}
 catch(e){
   console.log(e)
 }
 res.render('prescription',{ data })
})

app.use('/pdfFromHTML/:id', async function(req, res){

   console.log(req.body)
   let id = req.params.id
   let url = req.protocol+"://"+req.headers.host+"/"+'pdfFromHTML'+"/"+id+'?'

   let html = fs.readFileSync("template.html", "utf8");
   var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Doctor Prescription</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};
var users = [
  {
    name: "Shyam",
    age: "26",
  },
  {
    name: "Navjot",
    age: "26",
  },
  {
    name: "Vitthal",
    age: "26",
  },
];
var document = {
  html: html,
  data: {
    users: users,
  },
  path: "./output.pdf",
  type: "",
};
pdf.create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });

//   try{
//     dbConn.query(`UPDATE patient SET link = '${url}' WHERE pNumber = ${id}`,(err,result)=>{
//     if(err)
//     console.log(err)
//     else{
//       console.log("done",result)
//     }
//  })}
//  catch(e){
//    console.log(e)
//  }
//   user.addValues()
  // mailer(url.toString())
  // console.log(data)
  
})

app.get('/panelist/:dName',(req,res)=>{
  let data = null
  try{
    dbConn.query(`SELECT * FROM patient WHERE dName = '${req.params.dName}'`,(err,result)=>{
    if(err)
    console.log(err)
    else{
      console.log("done",result)
      res.render('panelist',{result})
    }
 })}
 catch(e){
   console.log(e)
 }

})

app.listen(3000,host,()=>{
    console.log("listening to port 3000")
})