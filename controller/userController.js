const dbConn = require("../config/dbConfig");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");
const options = require("../module/pdfTemplate");
const { url } = require("inspector");
const helperFunc = require("./helperFunc.js");
const { Transform } = require('stream');
const { BlobServiceClient } = require('@azure/storage-blob');

//Binding the pdf data
const html = fs.readFileSync(path.join(__dirname, '../public/template/template.html'), "utf8");

let data = "";

module.exports.index = (req, res) => {
  //Loading index.html
  res.render("index");
};

module.exports.prescription = (req, res) => {
  data = req.body;
  //SQL Query for inserting patient data
  try {
    dbConn.query(
      "INSERT INTO patient (pName,pNumber,pEmail,dName,link) VALUES (?,?,?,?,?)",
      [
        String(data.patient_name),
        parseInt(data.patient_phone),
        String(data.patient_email),
        String(data.doctor_name),
        "",
      ],
      (err, result) => {
        if (err) console.log(err);
        else {
          console.log("Patient Added");
        }
      }
    );
  } catch (e) {
    return res.status(502).send("Data cannot be uploaded");
  }
  //Loading prescription.html
  res.render("prescription", { data });
};

module.exports.generatePdf = async function (req, res) {
  const id = req.params.id;
  //Fetching prescription data from req object
  let today = new Date()
  // let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
  // let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  const users = [
    {
      date: today.toLocaleDateString("en-US", options),
      time: today.toLocaleTimeString(),
      docName: data != "" && data.doctor_name != undefined ? data.doctor_name : "",
      name: data != "" && data.patient_name != undefined ? data.patient_name : "",
      symptoms: req.body.symptoms != undefined ? req.body.symptoms.split("\n") : "",
      diagnosis: req.body.diagnosis != undefined ? req.body.diagnosis.split("\n") : "",
      prescription: req.body.prescription != undefined ? req.body.prescription.split("\n") : "",
      advice: req.body.advice != undefined ? req.body.advice.split("\n") : "",
    }
  ];
  console.log("RECIEVED DATA", users);
  //Set pdf path in public directory
  const downloadPath = path.join(__dirname, `../public/pdf/${id}.pdf`);
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: downloadPath,
    type: "stream",
  };
  let readStream = await pdf.create(document, options)
  await helperFunc.uploadBlob(readStream,id)
  //const getTagsResponse = await blockBlobClient.getTags();
  // console.log("RESULT AFTER UPLOAD", resp);
  const downloadUrl = `https://projblobstorage.blob.core.windows.net/pdfstore/${id}.pdf`;
  await helperFunc.updateLink(downloadUrl,id)
  await helperFunc.sendMail(downloadUrl,id)
  //await createBlobFromReadStream(containerClient, `${container}.pdf`, readStream, uploadOptions);
  // .then((res) => {
  //   //URL to pdf generated
  //   console.log("after pdf output",res);
  //   const url = req.protocol + "://" + req.headers.host + "/" + "pdf" + "/" + id;
  //   console.log(url)
  //   helperFunc.updateLink(url, id);
  //   return url;
  // })
  // .then((url) => {
  //   helperFunc.sendMail(url,id);
  //   return;
  // })
  // .catch((error) => {
  //   return res.status(400).send("Pdf generation failed");
  // });
  //Sending pdf to user (download)
  
  //console.log(`download of ${blobName} success`);
  // res.download("https://projblobstorage.blob.core.windows.net/pdfstore/ashish.pdf", function (err) {
  //   if (err) {
  //     console.log("Download Error");
  //     console.log(err);
  //     return res.status(404).send("pdf not found");
  //   } else {
  //     console.log("Download Success");
  //   }
  // });
  res.status(200).send({
    url: downloadUrl
  })
};

module.exports.panelists = (req, res) => {
  try {
    //SQL query to fetch all patients belonging to the doctor
    dbConn.query(
      `SELECT * FROM patient WHERE dName = '${req.params.dName}'`,
      (err, result) => {
        if (err) console.log(err);
        else {
          console.log("done", result);
          //Loading panelist.html
          res.render("panelist", { result });
        }
      }
    );
  } catch (e) {
    return res.status(502).send("Database error");
  }
};

module.exports.downloadLink = (req, res) => {
  const id = req.params.id;
  res.download(path.join(__dirname, `../public/pdf/${id}.pdf`), function (err) {
    if (err) {
      console.log("Error");
      console.log(err);
    } else {
      console.log("Success");
    }
  });
};



