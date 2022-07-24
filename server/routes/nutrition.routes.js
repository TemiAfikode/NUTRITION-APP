"Use strict";

const express = require("express");
const nutritionController = require("../controllers");

const router = express.Router();

// const nutritionRoute = (router) => {
//route to search for a recipe
router.get("/recipe/search", nutritionController.seachRecipe);

//route to get additional information about a recipe ingredients
router.get("/recipe/calories", nutritionController.getRecipeCalories);

//route to get additional information about a recipe ingredients
router.get("/recipe/ingredients/info", nutritionController.getRecipeIngredientsDetails);

//exporting all available routes
module.exports = router;
