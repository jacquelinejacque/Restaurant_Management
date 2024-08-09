
import { Router } from "express";
import CustomerLogic from "../logic/CustomerLogic.js";

var CustomerHandler = Router();

CustomerHandler.post("/create", function (req, res) {
 
  CustomerLogic.create(req.body, function (result) {
    res.json(result);
  });
});

export default CustomerHandler;