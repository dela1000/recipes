import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dbState, currentUserState, loadingOverlayState } from '../../contexts/atoms/atoms';
import ShoppingListItem from '../ShoppingListItem';
import foodsCollection from '../../helpers/foodsCollection';
import shopppingGroups from '../../helpers/shoppingGroups';
import { updateRecipe } from '../../adapters/recipeAdapters';

export default function ShoppingListByGroup({ recipesOnShoppingList, getShoppingListRecipes }) {
  const [ingredientGroups, setIngredientGroups] = useState([]);
  const setLoading = useSetRecoilState(loadingOverlayState);
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);

  const checkShowGroup = (groudId) => {
    const groupToUpdate = ingredientGroups.find((x) => x.id === groudId);
    let showGroup = false;
    groupToUpdate.ingredients.forEach((ing) => {
      if (!ing.purchased) {
        showGroup = true;
      }
    });
    groupToUpdate.showGroup = showGroup;
    const foundIndex = ingredientGroups.findIndex((x) => x.id === groupToUpdate.id);
    ingredientGroups[foundIndex] = groupToUpdate;
    setIngredientGroups([...ingredientGroups]);
  };

  const updateShowGroup = (groudId) => {
    const foundIndex = ingredientGroups.findIndex((x) => x.id === groudId);
    ingredientGroups[foundIndex].showGroup = !ingredientGroups[foundIndex].showGroup;
    setIngredientGroups([...ingredientGroups]);
  };

  const sortIngredients = () => {
    setLoading(true);
    const allIngredients = {};

    recipesOnShoppingList.forEach((recipe) => {
      recipe.ingredients.forEach((ingredientsGroup, index) => {
        ingredientsGroup.ingredients.forEach((ingredient) => {
          const newIngredient = JSON.parse(JSON.stringify(ingredient));
          newIngredient.recipeObj = recipe;
          newIngredient.ingredientsGroupIndex = index;
          newIngredient.tempIndex = `${recipe.id}-${index}-${ingredient.index}`;
          allIngredients[newIngredient.string] = newIngredient;
        });
      });
    });
    const shopppingGroupsCopy = JSON.parse(JSON.stringify(shopppingGroups));
    foodsCollection.forEach((food) => {
      const groupId = food.shoppingGroupId;
      Object.keys(allIngredients).forEach((ingredient) => {
        const ingredientString = allIngredients[ingredient].string.toLowerCase();
        const found = ingredient.toLowerCase().match(food.name.toLocaleLowerCase());
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
        shopppingGroupsCopy[group].showGroup = true;
        ingredientsArray.push(shopppingGroupsCopy[group]);
      }
    });

    const sortedArray = orderBy(ingredientsArray, ['id'], ['asc']);
    sortedArray.forEach((item) => {
      item.ingredients = Object.values(item.ingredients);
    });
    const finalArray = JSON.parse(JSON.stringify(sortedArray));
    setIngredientGroups(finalArray);
    setLoading(false);
  };

  const updateShoppingListRecipe = async (ingredient, groupId) => {
    const recipeId = ingredient.recipeObj.id;
    const recipeToEdit = recipesOnShoppingList.find((x) => x.id === recipeId);
    const parsedRecipeToEdit = JSON.parse(JSON.stringify(recipeToEdit));

    parsedRecipeToEdit.ingredients[ingredient.ingredientsGroupIndex].ingredients.forEach(
      (recipeIng, idx) => {
        if (ingredient.string === recipeIng.string) {
          parsedRecipeToEdit.ingredients[ingredient.ingredientsGroupIndex].ingredients[
            idx
          ].purchased = ingredient.purchased;
        }
      },
    );

    await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: parsedRecipeToEdit.id,
      payload: parsedRecipeToEdit,
    });
    await getShoppingListRecipes();
    checkShowGroup(groupId);
  };

  useEffect(() => {
    sortIngredients();
  }, [recipesOnShoppingList]);

  return (
    <div>
      {ingredientGroups.map((group) => (
        <div key={group.id}>
          <button type="button" onClick={() => updateShowGroup(group.id)}>
            <div className="text-xl mt-3 capitalize italic">{group.name}</div>
          </button>
          <div className={!group.showGroup ? 'hidden' : 'block'}>
            {group.ingredients.map((ingredient) => (
              <ShoppingListItem
                groupId={group.id}
                key={ingredient.tempIndex}
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
