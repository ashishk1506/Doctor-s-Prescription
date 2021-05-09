const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
require('dotenv').config()
const pdfMake = require('pdfmake')
const mailer = require('./module/mailer')
const dbConn = require('./config/dbConfig')
const host = '0.0.0.0'
const PORT = 3000 || process.env.PORT

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

app.use('/pdfFromHTML/:id', function(req, res){
   console.log(req.body)
   let id = req.params.id
   let url = req.protocol+"://"+req.headers.host+"/"+'pdfFromHTML'+"/"+id+'?'
  //  let documentDef = {
  //    content :[
  //      `${req.body}`
  //    ]
  //  }
  //  const pdfDoc = pdfMake.createPdf(documentDef)
  //  pdfDoc.getBase64((data)=>{
  //    res.writeHead(200,
  //     {
  //        'Content-Type':'application/pdf',
  //        'Content-Disposition':"attachmnet;filename-'filename.pdf'"
  //     })
  //     const download = Buffer.from(data.toString('utf-8'),'base-64')
  //     res.end(download)
  //  })
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
  user.addValues()
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

app.listen(PORT,host,()=>{
    console.log("listening to port 3000")
})