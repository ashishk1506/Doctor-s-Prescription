require('dotenv').config()
const util = require("util")
const mysql = require("mysql")
const fs = require("fs")

//Setting up database credentials
let dbConn;
if(process.env.SSL == 1)
{
  dbConn = mysql.createPool({
    host : process.env.DB_HOST_SSL,
    user : process.env.DB_USER_SSL,
    password : process.env.DB_PASS_SSL,
    database : process.env.DB_DATABASE_SSL,
    port : process.env.DB_PORT,
    ssl:{ca:fs.readFileSync(__dirname+'/ssl/DigiCertGlobalRootCA.crt.pem'),rejectUnauthorized: true}
 })
}else if(process.env.SSL == 0){
  dbConn = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
    port : process.env.DB_PORT
  })
}

//creating database pool connection
dbConn.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to Database");
  }
  if (connection) connection.release();
  return
})

dbConn.query = util.promisify(dbConn.query);
module.exports = dbConn;