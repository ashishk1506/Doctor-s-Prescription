const dbConn = require("../config/dbConfig");
const mailer = require("../module/mailer");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");

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
        data.patient_name,
        parseInt(data.patient_phone),
        data.patient_email,
        data.doctor_name,
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
    return res.status(502).send("Data cannot be uploaded")
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
  //Binding the pdf data
  const html = fs.readFileSync("template/template.html", "utf8");
  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents: '<div style="text-align: center;">Doctor Prescription</div>',
    },
    footer: {
      height: "28mm",
      contents: {
        first: "Cover page",
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: "Last Page",
      },
    },
  };
  //Creating pdf
  //Set pdf path in public directory
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: path.join(__dirname, `../public/pdf/${id}.pdf`),
    type: "",
  };
  await pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      return res.status(400).send("Pdf generation failed")
    });

  //URL to pdf generated
  const url =
    req.protocol +
    "://" +
    req.headers.host +
    "/" +
    "pdf" +
    "/" +
    id;
  console.log("URL", url);
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
    return res.status(502).send("Database error")
  }
  try {
    //SQL Query for getting Email of patient
    dbConn.query(
      `SELECT pEmail from patient WHERE pNumber = ${id} ORDER BY id DESC`,
      (err, result) => {
        if (err) console.log(err);
        else {
          //Setting up Mail Service
          mailer(url.toString(),result[0].pEmail);
        }
      }
    );
  } catch (e) {
    return res.status(502).send("Database error")
  }

  //Sending pdf to user (download)
  const downloadPath = path.join(__dirname, `../public/pdf/${id}.pdf`);
  console.log("Download Path", downloadPath)
  res.download(
    downloadPath,
    function (err) {
      if (err) {
        console.log("Download Error");
        console.log(err);
        return res.status(404).send("pdf not found")
      } else {
        console.log("Download Success");
      }
    }
  );
};

module.exports.panelists = (req, res) => {
  try {
    //SQL query to fetch all patients belonging to the doctor
    dbConn.query(
      `SELECT * FROM patient WHERE dName = '${req.params.dName}'`,
      (err, result) => {
        if (err) 
        console.log(err)
        else {
          console.log("done", result);
          //Loading panelist.html
          res.render("panelist", { result });
        }
      }
    );
  } catch (e) {
    return res.status(502).send("Database error")
  }
};


module.exports.downloadLink = (req,res)=>{
  const id = req.params.id
  res.download(path.join(__dirname,`../public/pdf/${id}.pdf`), function (err) {
    if (err) {
        console.log("Error");
        console.log(err);
    } else {
        console.log("Success");
    }    
})
}