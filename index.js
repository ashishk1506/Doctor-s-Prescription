const express = require('express')
const app = express()
const path = require('path')


app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.get('/',(req,res)=>{
  res.render('index')
})

app.listen(3000,()=>{
    console.log("listening to port 3000")
})