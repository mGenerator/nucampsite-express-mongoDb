const express = require("express");
const Campsite = require("../models/campsite");

const campsiteRouter = express.Router();

campsiteRouter
  .route("/")
  .get((req, res, next) => {
    //for handling http get requests
    Campsite.find()
      .then((campsites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsites);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    //for handling http post requests
    Campsite.create(req.body)
      .then((campsite) => {
        console.log("Campsite Created ", campsite);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on '/campsites'.");
  })
  .delete((req, res, next) => {
    Campsite.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

//The following is for routes of particular campsites
campsiteRouter
  .route("/:campsiteId")
  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `Post operation not supported on "/campsites/${req.params.campsiteId}."`
    );
  })
  .put((req, res, next) => {
    Campsite.findByIdAndUpdate(
      req.params.campsiteId,
      { $set: req.body },
      { new: true }
    )
      .then((campsite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

//route for campsites/:campsiteId/comments
campsiteRouter
  .route("/:campsiteId/comments")
  .get((req, res, next) => {
    //for handling http get requests
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments);
        } else {
          const err = new Error(`Campsite ${req.params.campsiteId} was not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    //for handling http post requests to comments
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite) {
          campsite.comments.push(req.body);
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
        } else {
          const err = new Error(`Campsite ${req.params.campsiteId} was not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /campsites/${req.params.campsiteId}/comments.`
    );
  })
  .delete((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite) {
          for (let i = campsite.comments.length - 1; i >= 0; i--) {
            campsite.comments.id(campsite.comments[i]._id).deleteOne();
          }
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
        } else {
          const err = new Error(`Campsite ${req.params.campsiteId} was not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

//endpoints for /:campsiteId/comments/:commentId
campsiteRouter
  .route("/:campsiteId/comments/:commentId")
  .get((req, res, next) => {
    //for handling http get requests
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments.id(req.params.commentId));
        } else if (!campsite) {
          const err = new Error(`Campsite ${req.params.campsiteId} was not found.`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} was not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    //for handling http post requests to comments
    res.statusCode = 403;
    res.end(
      `Post operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}.`
    );
  })
  .put((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if (req.body.rating) {
            campsite.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.text) {
            campsite.comments.id(req.params.commentId).text = req.body.text;
          }
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
        } else if (!campsite) {
          const err = new Error(`Campsite ${req.params.campsiteId} was not found.`);
          err.status = 404;
          return next(err);
        } else {
         const err = new Error(`Comment ${req.params.commentId} was not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          campsite.comments.id(req.params.commentId).deleteOne();
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
        } else if (!campsite) {
         const err = new Error(`Campsite ${req.params.campsiteId} was not found.`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} was not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = campsiteRouter;
