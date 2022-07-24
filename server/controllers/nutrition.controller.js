"use strict";
const axios = require("axios");
const _ = require("lodash");
const { makeListFromIngredients } = require("../utils/nutrition.utils");
const nutrientsPerGramCaloriesEquivalent = {
  protein: 4,
  carbohydrates: 4,
  fat: 9,
};

const seachRecipe = async (req, res) => {
  const recipeName = req.query.recipeName;

  if (!recipeName) res.status(400).json({ message: "Recipe name is required" });

  try {
    const options = {
      method: "GET",
      url: `https://${process.env.RECIPES_API_HOST_URL}/recipes/${recipeName}`,
      params: { maxRecipes: "20" },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RECIPES_API_HOST_URL,
      },
    };

    const recipes = await axios.request(options);
    res.status(200).json(recipes?.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeCalories = async (req, res) => {
  let recipeNutrition = req.body.nutrition;
  recipeNutrition = recipeNutrition ? JSON.parse(recipeNutrition) : {};

  if (_.isEmpty(recipeNutrition))
    res.status(400).json({
      message: "List of recipe nutrients is required to calculate total number of calories",
    });

  const { protein, carbohydrates, fat } = recipeNutrition;

  if (!protein || !carbohydrates || !fat)
    res.status(400).json({
      message:
        "Protein, Carbohydrates and Fat content in recipe is required to calculate total number of calories",
    });

  const totalCalories =
    parseFloat(carbohydrates) *
      nutrientsPerGramCaloriesEquivalent.carbohydrates *
      (parseFloat(protein) * nutrientsPerGramCaloriesEquivalent.protein) +
    parseFloat(fat) * nutrientsPerGramCaloriesEquivalent.fat;

  res.status(200).json(`${Math.round(totalCalories)} Calories`);
};

const getRecipeIngredientsDetails = async (req, res) => {
  let recipeIngredients = req.body.ingredients;
  recipeIngredients = recipeIngredients ? JSON.parse(recipeIngredients) : "";

  if (_.isEmpty(recipeIngredients))
    res
      .status(400)
      .json({ message: "List of ingredients is required to get additional information" });
  try {
    const ingredientsList = makeListFromIngredients(recipeIngredients);

    const ingredientsListAdditionalInfo = await getIngredientsAdditionalInfo(ingredientsList);

    res.status(200).json(ingredientsListAdditionalInfo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getIngredientsAdditionalInfo = async (ingredientsList) => {
  return await Promise.all(
    ingredientsList.map(async (ingredient) => {
      const options = {
        method: "GET",
        url: `https://${process.env.EDAMAM_FOOD_AND_GROCERY_DATABASE_HOST_URL}/parser`,
        params: { ingr: ingredient?.value },
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": process.env.EDAMAM_FOOD_AND_GROCERY_DATABASE_HOST_URL,
        },
      };

      const response = await axios.request(options);
      const ingredientAdditionalInfo = response?.data?.hints[0]?.food;
      return {
        ...ingredient,
        nutrition: ingredientAdditionalInfo.nutrients,
        category: ingredientAdditionalInfo?.category,
        image: ingredientAdditionalInfo?.image,
      };
    })
  );
};

module.exports = {
  seachRecipe,
  getRecipeCalories,
  getRecipeIngredientsDetails,
};
