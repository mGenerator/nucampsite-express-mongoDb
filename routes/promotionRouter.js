const express = require('express');
const promotionRouter = express.Router();

const Promotion = require('../models/promotion');

promotionRouter
  .route("/")
  .get((req, res, next) => {
    Promotion.find()
    .then(promotion =>{
      res.status(200).json(promotion)
    })
    .catch(error => next(error));
  })
  .post((req, res, next) => {
    Promotion.create(req.body)
    .then(promotion =>{
      res.status(200).json(promotion);
    })
    .catch(error => next(error));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on '/promotion'.");
  })
  .delete((req, res, next) => {
    Promotion.deleteMany()
    .then(response =>{
      res.status(200).json(response);
    })
    .catch(error => next(error));
  });

  //The following is for routes of particular Promotions
promotionRouter.route("/:promotionId")
.get((req, res,next)=>{
  Promotion.findById(req.params.PromotionId)
  .then(promotion =>{
    res.status(200).json(promotion)
  })
  .catch(error => next(error));
})
.post((req, res)=>{
res.statusCode = 403;
res.end(`Post operation not supported on "/promotion/${req.params.promotionId}."`);
})
.put((req, res, next)=>{
Promotion.findByIdAndUpdate(req.params.promotionId, req.body, {new: true})
.then(promotion =>{
  res.status(200).json(promotion);
})
.catch(error => next(error));
})
.delete((req, res, next)=>{
Promotion.findByIdAndDelete(req.params.promotionId)
.then(promotion => res.status(200).json(promotion))
.catch(error => next(error));
});

module.exports = promotionRouter;