import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function RecipeOptions({ recipe }) {
  const history = useHistory();
  const [{ db, currentUser, setRecipe, setRecipeId }] = useContext(Context);

  const handleFavoriteSelected = async () => {
    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: recipe.id,
      payload: {
        favorite: !recipe.favorite,
      },
    });

    setRecipe(updatedRecipe);
    setRecipeId(updatedRecipe.id);
  };

  const editRecipe = (recipeToUpdate) => {
    setRecipe(recipeToUpdate);
    setRecipeId(recipeToUpdate.id);
    history.push(`/editrecipe`);
  };

  const addToShoppingList = async () => {
    const dataToUpdate = {
      onShoppingList: !recipe.onShoppingList,
    };

    if (recipe.onShoppingList) {
      Object.keys(recipe.ingredients).forEach((key) => {
        recipe.ingredients[key].forEach((ingredient) => {
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

    setRecipe(updatedRecipe);
    setRecipeId(updatedRecipe.id);
  };

  return (
    <div className="pt-3">
      <button
        className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-14 mx-1 h-9"
        type="button"
        onClick={() => {
          handleFavoriteSelected();
        }}
      >
        <StarIcon
          fontSize="small"
          className={`${recipe.favorite ? `text-yellow-400` : 'text-white'} fill-current`}
        />
      </button>
      <button
        className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-14 mx-1 h-9"
        type="button"
        onClick={() => {
          addToShoppingList(recipe);
        }}
      >
        <ShoppingCartIcon
          fontSize="small"
          className={`${recipe.onShoppingList ? `text-yellow-400` : 'text-white'} fill-current`}
        />
      </button>
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
    ingredients: PropTypes.shape({}).isRequired,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
