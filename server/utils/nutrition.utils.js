const measures = [
  "tbsp",
  "tablespoon",
  "tsp",
  "teaspoon",
  "oz",
  "ounce",
  "ounces",
  "cup",
  "qt",
  "packet",
  "quart",
  "pt",
  "pint",
  "gal",
  "gallon",
  "mL",
  "ml",
  "milliliter",
  "g",
  "grams",
  "kg",
  "kilogram",
  "l",
  "liter",
  "fl. oz",
  "fluid ounce",
  "fluid ounces",
]; // plural after singular!
const action = ["chopped", "ground"];

const compound = measures.filter((measure) => measure.split(" ").length > 1); // extract compound words

const quantityOfIngredientsUsed = /^(\d+\/\d+|¼|½|¾|\d|\d+)/; // amounts like 1, 1/2 etc
const amountValueRe = /(\d+\/\d+|¼|½|¾|\d|\d+) ([\w.]+) (.*)/; // first part must be the same as quantityOfIngredientsUsed

const makeListFromIngredients = (ingredients) =>
  ingredients.map((ingredient) => {
    if (!quantityOfIngredientsUsed.test(ingredient)) return { value: ingredient }; // no amounts found

    // test for compound measures
    compound.forEach((cmp) => (ingredient = ingredient.replace(cmp, cmp.split(" ").join("_")))); // add underscores if found

    // destruct the match on amount plus value or amount of amount plus value
    let [, quantity, measurement, foodItem] = ingredient.match(amountValueRe);

    if (action.includes(measurement.toLowerCase())) {
      // test for chopped
      foodItem = `${measurement} ${foodItem}`; // or add an action item to the object
      measurement = "";
    }

    const obj = {};
    if (quantity) obj.amount = quantity;
    if (measurement) obj.measurement = measurement.split("_").join(" ").trim(); // remove added underscores and any additional info added to ingredients
    if (foodItem) obj.value = foodItem.split(",")[0];
    return obj;
  });

module.exports = {
  makeListFromIngredients,
};
