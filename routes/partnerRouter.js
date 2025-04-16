const express = require("express");
const partnerRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");
const Partner = require("../models/partner");

module.exports = partnerRouter;

partnerRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.status(200).json(partners);
      })
      .catch((error) => next(error));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      Partner.create(req.body)
        .then((partner) => {
          res.status(200).json(partner);
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
      res.end("PUT operation not supported on '/partners'.");
    }
  )
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Partner.deleteMany()
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => next(error));
  });

//The following is for routes of particular partners
partnerRouter
  .route("/:partnerId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.status(200).json(partner);
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
        `Post operation not supported on "/partners/${req.params.partnerId}."`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndUpdate(req.params.partnerId, req.body, { new: true })
        .then((partner) => {
          res.status(200).json(partner);
        })
        .catch((error) => next(error));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((partner) => res.status(200).json(partner))
        .catch((error) => next(error));
    }
  );

module.exports = partnerRouter;
