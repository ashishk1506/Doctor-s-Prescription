
const dbConn = require("../config/dbConfig");
const mailer = require("../module/mailer");
let data = null;

module.exports.index = (req, res) => {
    res.render("index");
  }

module.exports.prescription = (req, res) => {
    data = req.body;
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
            console.log("done", result);
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
    res.render("prescription", { data });
  }


  module.exports.generatePdf = async function (req, res) {
    console.log(req.body);
    let id = req.params.id;
    let html = fs.readFileSync("template.html", "utf8");
    let options = {
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
    let users = [
      {
        name: req.body.name,
        symptoms: req.body.symptoms,
        diagnosis: req.body.diagnosis,
        prescription: req.body.prescription,
        advice: req.body.advice,
      },
    ];
    const document = {
      html: html,
      data: {
        users: users,
      },
      path: path.join(__dirname, `/public/${req.body.name}.pdf`),
      type: "",
    };
    await pdf
      .create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
    const url =
      req.protocol + "://" + req.headers.host + "/" + "pdf" + "/" + req.body.name;
  
    try {
      dbConn.query(
        `UPDATE patient SET link = '${url}' WHERE pNumber = ${id}`,
        (err, result) => {
          if (err) console.log(err);
          else {
            console.log("done", result);
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
    //   user.addValues()
    mailer(url.toString());
    // console.log(data)
    res.download(
      path.join(__dirname, `/public/${req.body.name}.pdf`),
      function (err) {
        if (err) {
          console.log("Error");
          console.log(err);
        } else {
          console.log("Success");
        }
      }
    );
  }

  module.exports.panelists = (req, res) => {
    let data = null;
    try {
      dbConn.query(
        `SELECT * FROM patient WHERE dName = '${req.params.dName}'`,
        (err, result) => {
          if (err) console.log(err);
          else {
            console.log("done", result);
            res.render("panelist", { result });
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  module.exports.download = (req, res) => {
    res.download(
      path.join(__dirname, `/public/${req.params.name}.pdf`),
      function (err) {
        if (err) {
          console.log("Error");
          console.log(err);
        } else {
          console.log("Success");
        }
      }
    );
  }