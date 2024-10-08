
import { Router } from "express";
import UserLogic from "../logic/UserLogic.js";

var UserHandler = Router();

UserHandler.post("/create", function (req, res) {
 
  UserLogic.create(req.body, function (result) {
    res.json(result);
  });
});
UserHandler.post("/login", function (req, res) {
  UserLogic.login(req.body, function (result) {
    res.json(result);
  });
});

export default UserHandler;