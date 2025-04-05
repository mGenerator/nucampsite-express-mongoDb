const express = require('express');
const partnerRouter = express.Router();

const Partner = require('../models/partner');

module.exports = partnerRouter;

partnerRouter
  .route("/")
  .get((req, res, next) => {
    Partner.find()
    .then(partners =>{
      res.status(200).json(partners)
    })
    .catch(error => next(error));
  })
  .post((req, res) => {
    Partner.create(req.body)
    .then(partner =>{
      res.status(200).json(partner);
    })
    .catch(error => next(error));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on '/partners'.");
  })
  .delete((req, res, next) => {
    Partner.deleteMany()
    .then(response =>{
      res.status(200).json(response);
    })
    .catch(error => next(error));
  });

  //The following is for routes of particular partners
partnerRouter.route("/:partnerId")
.get((req, res,next)=>{
  Partner.findById(req.params.partnerId)
  .then(partner =>{
    res.status(200).json(partner)
  })
  .catch(error => next(error));
})
.post((req, res)=>{
res.statusCode = 403;
res.end(`Post operation not supported on "/partners/${req.params.partnerId}."`);
})
.put((req, res, next)=>{
Partner.findByIdAndUpdate(req.params.partnerId, req.body, {new: true})
.then(partner =>{
  res.status(200).json(partner);
})
.catch(error => next(error));
})
.delete((req, res, next)=>{
Partner.findByIdAndDelete(req.params.partnerId)
.then(partner => res.status(200).json(partner))
.catch(error => next(error));
});

module.exports = partnerRouter;