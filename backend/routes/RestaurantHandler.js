
import { Router } from "express";
import RestaurantLogic from "../logic/RestaurantLogic.js";

var RestaurantHandler = Router();

// Route handler for creating a restaurant
RestaurantHandler.post("/create", function (req, res) {
 
  RestaurantLogic.create(req.body, function (result) {
    res.json(result);
  });
});

// Route handler for listing restaurant
RestaurantHandler.get("/list", (req, res) => {
    RestaurantLogic.list(req.query, (result) => {
        res.json(result);
    });
});

export default RestaurantHandler;