const express = require('express')
const app = express()
const path = require('path')
const pdf = require('express-pdf');

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(pdf)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.get('/',(req,res)=>{
  res.render('index')
})

app.post('/prescription/',(req,res)=>{
 const data = req.body
 console.log(data)
 res.render('prescription',{ data })
})

app.use('/pdfFromHTML/:id', function(req, res){
  
  res.pdfFromHTML({
      filename: req.params.id,
      html: path.resolve(__dirname, './views/prescription.ejs'),
  })
})

app.listen(3000,()=>{
    console.log("listening to port 3000")
})