import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import AddToShoppingListButton from '../AddToShoppingListButton';
import FavoriteButton from '../FavoriteButton';

import { updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function RecipeOptions({ recipe }) {
  const [updatingFavorite, setUpdatingFavorite] = useState(false);
  const [updatingShopping, setUpdatingShopping] = useState(false);
  const history = useHistory();
  const [{ db, currentUser, setRecipe, setRecipeId }] = useContext(Context);

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
      <FavoriteButton
        favorite={recipe.favorite}
        updating={updatingFavorite}
        handleFavoriteSelected={handleFavoriteSelected}
      />
      <AddToShoppingListButton
        onShoppingList={recipe.onShoppingList}
        updating={updatingShopping}
        handleAddToShoppingList={handleAddToShoppingList}
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

RecipeOptions.propTypes = {
  recipe: PropTypes.shape({
    image: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    favorite: PropTypes.bool,
    originalURL: PropTypes.string,
    source: PropTypes.string,
    onShoppingList: PropTypes.bool,
    ingredients: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
