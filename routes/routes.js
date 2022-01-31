const router = require('express').Router();

const userController = require("../controller/userController")

//render index page 
router.get("/", userController.index);

//collecting data
router.post("/prescription/", userController.prescription);

//generating pdf
router.use("/pdfFromHTML/:id", userController.generatePdf);

//loading panelist  
router.get("/panelist/:dName", userController.panelists);

module.exports = router