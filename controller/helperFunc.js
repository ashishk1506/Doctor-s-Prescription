const dbConn = require("../config/dbConfig");
const mailer = require("../module/mailer");
const { Transform } = require('stream');
const { BlobServiceClient } = require('@azure/storage-blob');
const { url } = require("inspector");


module.exports.uploadBlob = async (readStream,id) => {

  const connString = "DefaultEndpointsProtocol=https;AccountName=projblobstorage;AccountKey=Gj9f9MsUGOr/YN26eqSfUl/WS6VK35tt7mnZN0gaCcMYiCzVpi1ykx+PCjf9JhAUgpgAtKmLRMkp+AStEI5YSQ==;EndpointSuffix=core.windows.net";
  if (!connString) throw Error('Azure Storage Connection string not found');
  const container = "pdfstore";
  const client = BlobServiceClient.fromConnectionString(connString);
  const containerClient = client.getContainerClient(container);
  const uploadOptions = {
    metadata: {
      owner: 'Ashish'
    },
    tags: {
      createdBy: 'Ashish',
      createdWith: `StorageSnippetsForDocs`,
      createdOn: (new Date()).toDateString()
    }
  }
  const blobName = id;
  const blockBlobClient = await containerClient.getBlockBlobClient(`${blobName}.pdf`);
  const bufferSize = 4 * 1024 * 1024;
  const maxConcurrency = 20;
  //const transformedReadableStream = readableStream.pipe(myTransform);
  await blockBlobClient.uploadStream(readStream, bufferSize, maxConcurrency, uploadOptions);
}


module.exports.updateLink = async (url, id) => {
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

module.exports.sendMail = async (url, id) => {
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