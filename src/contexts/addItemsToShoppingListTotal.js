export default function addItemsToShoppingListTotal(recipesToSee, currentAmount) {
  let itemsOnShoppingList = currentAmount || 0;
  recipesToSee.forEach((recipe) => {
    if (recipe.onShoppingList) {
      recipe.ingredients.forEach((ingredientGroup) => {
        itemsOnShoppingList += ingredientGroup.ingredients.length;
      });
    }
  });
  return itemsOnShoppingList;
}
