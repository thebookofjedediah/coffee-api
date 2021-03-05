let multer = require('multer')
let axios = require('axios')
let cloudinary = require('cloudinary').v2;
const FormData = require('form-data');
let fs = require('fs')
const { 
    CLOUDINARY_API_KEY, 
    CLOUDINARY_API_SECRET, 
    CLOUDINARY_NAME, 
    PICPURIFY_API_KEY, 
    PICPURIFY_URL} = require("../config");

// Setup cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// Set up multer to write incoming files to the tmp directory
var upload = multer({ dest: 'tmp/' })

// url to validate pic
var picpurifyUrl = PICPURIFY_URL;

async function checkPhoto(filePath) {
  const form = new FormData();
  form.append('file_image', fs.createReadStream(filePath));
  form.append('API_KEY', PICPURIFY_API_KEY);
  form.append('task','porn_moderation,drug_moderation,gore_moderation');
  let checkResults = await axios.post(picpurifyUrl, form, { headers: form.getHeaders() })
  if (checkResults.data.status != "success"){
    console.error(checkResults.data);
    return false
  }
  return true
}

async function uploadPhoto(filePath) {
  let uploaded = await cloudinary.uploader.upload(
    filePath, 
    { resource_type: "auto" }
  ).catch(error => console.log(error.message));
  return uploaded.url
}

module.exports = {checkPhoto, uploadPhoto}