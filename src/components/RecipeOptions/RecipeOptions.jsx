import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { currentUserState, dbState, recipeState, recipeIdState } from '../../contexts/atoms/atoms';
import MiscUpdateRecipeButton from '../MiscUpdateRecipeButton';

import { updateRecipe } from '../../adapters/recipeAdapters';

export default function RecipeOptions() {
  const [updatingFavorite, setUpdatingFavorite] = useState(false);
  const [updatingShopping, setUpdatingShopping] = useState(false);
  const history = useHistory();

  const db = useRecoilState(dbState);
  const [recipe, setRecipe] = useRecoilState(recipeState);
  const setRecipeId = useSetRecoilState(recipeIdState);
  const currentUser = useRecoilValue(currentUserState);

  const editRecipe = (recipeToUpdate) => {
    setRecipe(recipeToUpdate);
    setRecipeId(recipeToUpdate.id);
    history.push(`/editrecipe`);
  };

  const handleFavoriteSelected = async () => {
    setUpdatingFavorite(true);
    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: recipe.id,
      payload: {
        favorite: !recipe.favorite,
      },
    });
    setUpdatingFavorite(false);
    setRecipe(updatedRecipe);
    setRecipeId(updatedRecipe.id);
  };

  const handleAddToShoppingList = async () => {
    setUpdatingShopping(true);
    const dataToUpdate = {
      onShoppingList: !recipe.onShoppingList,
    };

    if (recipe.onShoppingList) {
      recipe.ingredients.forEach((ingredientsGroup) => {
        ingredientsGroup.ingredients.forEach((ingredient) => {
          ingredient.purchased = false;
        });
      });
    }

    dataToUpdate.ingredients = recipe.ingredients;

    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: recipe.id,
      payload: dataToUpdate,
    });
    setUpdatingShopping(false);
    setRecipe(updatedRecipe);
    setRecipeId(updatedRecipe.id);
  };

  return (
    <div className="pt-3">
      <MiscUpdateRecipeButton
        type="favorite"
        itemToUpdate={recipe.favorite}
        updating={updatingFavorite}
        handleFunction={handleFavoriteSelected}
      />
      <MiscUpdateRecipeButton
        type="onShoppingList"
        itemToUpdate={recipe.onShoppingList}
        updating={updatingShopping}
        handleFunction={handleAddToShoppingList}
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
