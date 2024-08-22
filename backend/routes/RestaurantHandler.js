
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

// RestaurantUpdateRoute.js
RestaurantHandler.put('/update/:id', (req, res) => {
    RestaurantLogic.update(req.params.id, req.body, (result) => {
        res.status(result.status).json(result);
    });
});

// Route handler for deleting a restaurant
RestaurantHandler.delete("/delete/:id", (req, res) => {
    const restaurantId = req.params.id;

    RestaurantLogic.delete(restaurantId, (result) => {
        res.json(result);
    });
});

export default RestaurantHandler;