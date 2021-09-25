export default function recipeToEdit(recipe) {
  let ingredientsString = '';
  let instructionsString = '';
  let categoriesString = '';

  recipe.ingredients.forEach((ingredientsGroup) => {
    if (ingredientsGroup.ingredients.length > 0) {
      ingredientsString += `[${ingredientsGroup.groupName}] \n`;
      ingredientsGroup.ingredients.forEach((ingredient) => {
        if (ingredient.quantity) {
          ingredientsString += `${ingredient.quantity} `;
        }
        if (ingredient.string) {
          ingredientsString += `${ingredient.string} \n`;
        }
      });
    }
  });

  recipe.instructions.forEach((instructionsGroup) => {
    if (instructionsGroup.instructions.length > 0) {
      instructionsString += `[${instructionsGroup.groupName}] \n`;
      instructionsGroup.instructions.forEach((instruction) => {
        instructionsString += `${instruction} \n`;
      });
    }
  });

  recipe.categories.forEach((category) => {
    categoriesString += `${category}, \n`;
  });

  const dataToEdit = JSON.parse(JSON.stringify(recipe));

  dataToEdit.ingredients = ingredientsString;
  dataToEdit.instructions = instructionsString;
  dataToEdit.categories = categoriesString;

  return dataToEdit;
}
