require('dotenv').config()
const util = require("util")
const mysql = require("mysql")
const fs=require('fs')
const path=require('path')

let dbConn = mysql.createPool({
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_NAME,
  // multipleStatements: true
  host: 'benpmbp84xkrym4yz3bz-mysql.services.clever-cloud.com',
  user: 'u1hql9occut1cyai',
  port : '3306',
  password: 'kqeSj0Rc7xBCDdo7L5FL',
  database: 'benpmbp84xkrym4yz3bz',
  multipleStatements: true
})

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