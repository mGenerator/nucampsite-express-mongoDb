const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null,'public/images');
  },
  filename: (req, file, cb)=>{
    cb(null,file.originalname);
  }
});

const imageFileFilter = (req, file, cb)=>{
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    return cb(new Error('You can upload only image files!'), false);
  }
  cb(null, true);
};
const upload = multer({storage: storage, fileFilter: imageFileFilter});

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res)=>{
  res.statusCode = 403;
  res.end('GET operation not supported on /imageUpload.');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res)=>{
  res.statusCode = 200;
  res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res)=>{
  res.statusCode = 403;
  res.end('PUT operation not supported on /imageUpload.');
}).delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res)=>{
  res.statusCode = 403;
  res.end('DELETE operation not supported on /imageUpload.');
});




uploadRouter.route

module.exports = uploadRouter;