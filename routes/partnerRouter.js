const express = require('express');
const partnerRouter = express.Router();

module.exports = partnerRouter;

partnerRouter
  .route("/")
  .all((req, res, next) => {
    //.all acts as a catch all response for http all verbs
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next(); //passes the control of the application routing to the next relevant routing method after this one. otherwise it would stop here
  })
  .get((req, res) => {
    //for handling http get requests
    res.end("Will send all the partners to you.");
  })
  .post((req, res) => {
    //for handling http post requests
    res.end(
      `Will add the partner: ${req.body.name} with description: ${req.body.description}.`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on '/partners'.");
  })
  .delete((req, res) => {
    res.end("Deleting all partners.");
  });

  //The following is for routes of particular partners
partnerRouter.route("/:partnerId")
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
})
.get((req, res)=>{
  res.end(`Will send details of the partner: ${req.params.partnerId} to you.`);
})
.post((req, res)=>{
res.statusCode = 403;
res.end(`Post operation not supported on "/partners/${req.params.partnerId}."`);
})
.put((req, res)=>{
res.write(`Updating the partner: ${req.params.partnerId}.\n`);
res.end(`Will update the partner: ${req.body.name} with description: ${req.body.description}.`);
})
.delete((req, res)=>{
res.end(`Deleting partner: ${req.params.partnerId}.`);
});

module.exports = partnerRouter;