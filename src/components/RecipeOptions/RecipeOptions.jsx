import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import {
  currentUserState,
  dbState,
  recipeState,
  recipeIdState,
  allRecipesState,
} from '../../contexts/atoms/atoms';
import MiscUpdateRecipeButton from '../MiscUpdateRecipeButton';

import { updateRecipe } from '../../adapters/recipeAdapters';

export default function RecipeOptions() {
  const history = useHistory();
  const [updatingFavorite, setUpdatingFavorite] = useState(false);
  const [updatingShopping, setUpdatingShopping] = useState(false);

  const db = useRecoilValue(dbState);

  const [recipe, setRecipe] = useRecoilState(recipeState);
  const [allRecipes, setAllRecipes] = useRecoilState(allRecipesState);
  const setRecipeId = useSetRecoilState(recipeIdState);
  const currentUser = useRecoilValue(currentUserState);

  const editRecipe = (recipeToUpdate) => {
    setRecipe(recipeToUpdate);
    setRecipeId(recipeToUpdate.id);
    history.push(`/editrecipe`);
  };

  const updateAllRecipesData = (updatedRecipe) => {
    const recipeIndex = allRecipes.findIndex((savedRecipe) => savedRecipe.id === recipe.id);
    const newRecipesArray = [...allRecipes];
    newRecipesArray[recipeIndex] = updatedRecipe;
    setRecipe(updatedRecipe);
    setRecipeId(updatedRecipe.id);
    setAllRecipes([...newRecipesArray]);
  };

  const handleUpdateRecipe = async (updateType) => {
    const parsedRecipe = JSON.parse(JSON.stringify(recipe));
    let dataToUpdate = {};
    if (updateType === 'favorite') {
      setUpdatingFavorite(true);
      dataToUpdate = {
        favorite: !parsedRecipe.favorite,
      };
    }
    if (updateType === 'shopping') {
      setUpdatingShopping(true);
      dataToUpdate = {
        onShoppingList: !parsedRecipe.onShoppingList,
      };

      if (parsedRecipe.onShoppingList) {
        parsedRecipe.ingredients.forEach((ingredientsGroup) => {
          ingredientsGroup.ingredients.forEach((ingredient) => {
            ingredient.purchased = false;
          });
        });
      }

      dataToUpdate.ingredients = parsedRecipe.ingredients;
    }
    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: parsedRecipe.id,
      payload: dataToUpdate,
    }).catch(() => {});
    setUpdatingFavorite(false);
    setUpdatingShopping(false);
    updateAllRecipesData(updatedRecipe);
  };

  return (
    <div className="pt-3">
      <MiscUpdateRecipeButton
        type="favorite"
        itemToUpdate={recipe.favorite}
        updating={updatingFavorite}
        handleFunction={() => handleUpdateRecipe('favorite')}
      />
      <MiscUpdateRecipeButton
        type="onShoppingList"
        itemToUpdate={recipe.onShoppingList}
        updating={updatingShopping}
        handleFunction={() => handleUpdateRecipe('shopping')}
      />
      <button
        className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 mx-1 h-9"
        type="button"
        onClick={() => {
          editRecipe(recipe);
        }}
      >
        Edit Recipe
      </button>
    </div>
  );
}
