import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';
import { allRecipesState, dbState, currentUserState } from '../../contexts/atoms/atoms';
import ShoppingListItem from '../ShoppingListItem';
import foodsCollection from '../../helpers/foodsCollection';
import shopppingGroups from '../../helpers/shoppingGroups';
import { updateRecipe } from '../../adapters/recipeAdapters';

export default function ShoppingListByGroup({ recipesOnShoppingList, getShoppingListRecipes }) {
  const [ingredientGroups, setIngredientGroups] = useState([]);
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const allRecipes = useRecoilValue(allRecipesState);

  const sortIngredients = () => {
    const allIngredients = {};

    recipesOnShoppingList.forEach((recipe) => {
      recipe.ingredients.forEach((ingredientsGroup, index) => {
        ingredientsGroup.ingredients.forEach((ingredient) => {
          const newIngredient = JSON.parse(JSON.stringify(ingredient));
          newIngredient.recipeObj = recipe;
          newIngredient.ingredientsGroupIndex = index;
          allIngredients[newIngredient.string] = newIngredient;
        });
      });
    });
    const shopppingGroupsCopy = JSON.parse(JSON.stringify(shopppingGroups));
    Object.keys(foodsCollection).forEach((food) => {
      const groupId = foodsCollection[food].shoppingGroupId;
      Object.keys(allIngredients).forEach((ingredient) => {
        const ingredientString = allIngredients[ingredient].string.toLowerCase();
        const found = ingredient.toLowerCase().match(food.toLocaleLowerCase());
        if (found) {
          if (!shopppingGroupsCopy[groupId].ingredients[ingredientString]) {
            shopppingGroupsCopy[groupId].ingredients[ingredientString] = allIngredients[ingredient];
            delete allIngredients[ingredient];
            delete shopppingGroupsCopy[0].ingredients[ingredientString];
          }
        } else {
          shopppingGroupsCopy[0].ingredients[ingredientString] = allIngredients[ingredient];
        }
      });
    });

    const ingredientsArray = [];

    Object.keys(shopppingGroupsCopy).forEach((group) => {
      if (!isEmpty(shopppingGroupsCopy[group].ingredients)) {
        ingredientsArray.push(shopppingGroupsCopy[group]);
      }
    });

    const sortedArray = orderBy(ingredientsArray, ['id'], ['asc']);
    sortedArray.forEach((item) => {
      item.ingredients = Object.values(item.ingredients);
    });
    const finalArray = JSON.parse(JSON.stringify(sortedArray));
    setIngredientGroups(finalArray);
  };

  const updateShoppingListRecipe = async (ingredient) => {
    const recipeId = ingredient.recipeObj.id;
    const recipeToEdit = allRecipes.find((x) => x.id === recipeId);
    const parsedRecipeToEdit = JSON.parse(JSON.stringify(recipeToEdit));

    parsedRecipeToEdit.ingredients[ingredient.ingredientsGroupIndex].ingredients[
      ingredient.index - 1
    ].purchased = true;

    await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: parsedRecipeToEdit.id,
      payload: parsedRecipeToEdit,
    });
    getShoppingListRecipes();
  };

  useEffect(() => {
    sortIngredients();
  }, [recipesOnShoppingList]);

  return (
    <div>
      {ingredientGroups.map((group) => (
        <div key={group.id}>
          <div className="text-xl mb-2 capitalize italic">{group.name}</div>
          <div>
            {group.ingredients.map((ingredient) => (
              <ShoppingListItem
                key={ingredient.index}
                ingredient={ingredient}
                updateShoppingListRecipe={updateShoppingListRecipe}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

ShoppingListByGroup.propTypes = {
  recipesOnShoppingList: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  getShoppingListRecipes: PropTypes.func.isRequired,
};
