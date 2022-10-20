const dbConn = require("../config/dbConfig");
const mailer = require("../module/mailer");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");
const options = require("../module/pdfTemplate");

//Binding the pdf data
const html = fs.readFileSync("template/template.html", "utf8");

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
  const users = [
    {
      name: req.body.name,
      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
      prescription: req.body.prescription,
      advice: req.body.advice,
    },
  ];

  //Set pdf path in public directory
  const downloadPath = path.join(__dirname, `../public/pdf/${id}.pdf`);
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: downloadPath,
    type: "",
  };
  await pdf
    .create(document, options)
    .then((res) => {
      //URL to pdf generated
      const url =
        req.protocol + "://" + req.headers.host + "/" + "pdf" + "/" + id;
      updateLink(url, id);
      return url;
    })
    .then((url) => {
      sendMail(url, id);
      return;
    })
    .catch((error) => {
      return res.status(400).send("Pdf generation failed");
    });
  //Sending pdf to user (download)
  res.download(downloadPath, function (err) {
    if (err) {
      console.log("Download Error");
      console.log(err);
      return res.status(404).send("pdf not found");
    } else {
      console.log("Download Success");
    }
  });
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


//helper function
const updateLink = (url, id) => {
  console.log(url);
  try {
    //SQL Query for setting URL to Pdf
    dbConn.query(
      `UPDATE patient SET link = '${url}' WHERE pNumber = ${id}`,
      (err, result) => {
        if (err) console.log(err);
        else {
          console.log("Link to Pdf Updated");
        }
      }
    );
  } catch (e) {
    return res.status(502).send("Database error");
  }
};

const sendMail = (url, id) => {
  try {
    //SQL Query for getting Email of patient
    dbConn.query(
      `SELECT pEmail, dName, pName from patient WHERE pNumber = ${id} ORDER BY id DESC`,
      (err, result) => {
        if (err) console.log(err);
        else {
          //Setting up Mail Service
          mailer(url.toString(), result[0]);
        }
      }
    );
  } catch (e) {
    return res.status(502).send("Database error");
  }
};
