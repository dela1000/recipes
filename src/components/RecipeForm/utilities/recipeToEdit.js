import forEach from 'lodash/forEach';

export default function recipeToEdit(recipe) {
  let ingredientsString = '';
  let instructionsString = '';
  let categoriesString = '';

  forEach(recipe.ingredients, (ingredientsList, key) => {
    if (key !== 'standard') ingredientsString += `[${key}] \n`;
    forEach(ingredientsList, (ingredient) => {
      if (ingredient.quantity) {
        ingredientsString += `${ingredient.quantity} `;
      }
      if (ingredient.string) {
        ingredientsString += `${ingredient.string} \n`;
      }
    });
  });

  forEach(recipe.instructions, (instructionsList, key) => {
    if (key !== 'standard') instructionsString += `[${key}] \n`;
    forEach(instructionsList, (instruction) => {
      instructionsString += `${instruction} \n`;
    });
  });

  forEach(recipe.categories, (category) => {
    categoriesString += `${category}, \n`;
  });

  const dataToEdit = JSON.parse(JSON.stringify(recipe));

  dataToEdit.ingredients = ingredientsString;
  dataToEdit.instructions = instructionsString;
  dataToEdit.categories = categoriesString;

  return dataToEdit;
}
