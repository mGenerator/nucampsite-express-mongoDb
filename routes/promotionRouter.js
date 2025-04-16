const express = require("express");
const promotionRouter = express.Router();
const authenticate = require("../authenticate");
const Promotion = require("../models/promotion");
const cors = require("./cors");

promotionRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Promotion.find()
      .then((promotion) => {
        res.status(200).json(promotion);
      })
      .catch((error) => next(error));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.create(req.body)
        .then((promotion) => {
          res.status(200).json(promotion);
        })
        .catch((error) => next(error));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on '/promotion'.");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.deleteMany()
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((error) => next(error));
    }
  );

//The following is for routes of particular Promotions
promotionRouter
  .route("/:promotionId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Promotion.findById(req.params.PromotionId)
      .then((promotion) => {
        res.status(200).json(promotion);
      })
      .catch((error) => next(error));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `Post operation not supported on "/promotion/${req.params.promotionId}."`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.findByIdAndUpdate(req.params.promotionId, req.body, {
        new: true,
      })
        .then((promotion) => {
          res.status(200).json(promotion);
        })
        .catch((error) => next(error));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.findByIdAndDelete(req.params.promotionId)
        .then((promotion) => res.status(200).json(promotion))
        .catch((error) => next(error));
    }
  );

module.exports = promotionRouter;
