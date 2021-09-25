import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import FavoriteButton from '../FavoriteButton';
import AddToShoppingListButton from '../AddToShoppingListButton';
import { updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function RecipeListItem({ recipe, handleCategoryChange, getRecipes }) {
  const [updatingFavorite, setUpdatingFavorite] = useState(false);
  const [updatingShopping, setUpdatingShopping] = useState(false);
  const [{ db, currentUser, setRecipeId, setRecipe }] = useContext(Context);
  const history = useHistory();
  const navigate = () => {
    history.push('/recipe');
  };

  const selectRecipe = () => {
    setRecipe(recipe);
    setRecipeId(recipe.id);
    navigate();
  };

  const handleFavoriteSelected = async () => {
    setUpdatingFavorite(true);
    await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: recipe.id,
      payload: {
        favorite: !recipe.favorite,
      },
    });
    setUpdatingFavorite(false);
    getRecipes();
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

    await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: recipe.id,
      payload: dataToUpdate,
    });
    setUpdatingShopping(false);
    getRecipes();
  };

  return (
    <div key={recipe.id}>
      <hr />
      <div className="flex">
        <div className="mt-3 mx-1">
          <div className="lg:flex flex-col">
            <div className="mb-1">
              <FavoriteButton
                favorite={recipe.favorite}
                updating={updatingFavorite}
                handleFavoriteSelected={handleFavoriteSelected}
              />
            </div>
            <div>
              <AddToShoppingListButton
                onShoppingList={recipe.onShoppingList}
                updating={updatingShopping}
                handleAddToShoppingList={handleAddToShoppingList}
              />
            </div>
          </div>
        </div>
        <div className="flex-initial mt-3 mr-3">
          <button type="button" onClick={selectRecipe} className="w-32 h-32">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt="food"
                className="object-cover min-h-full min-w-full w-32 h-32"
              />
            ) : (
              <div className="h-20 w-20 bg-gray-200" />
            )}
          </button>
        </div>
        <div className="flex-initial mt-6">
          <div>
            <div>
              <a
                className="text-xs text-blue-400"
                href={recipe.originalURL}
                target="_blank"
                rel="noreferrer"
              >
                {recipe.source}
              </a>
            </div>
          </div>
          <div className="flex">
            <div className="flex-initial">
              <button
                className="capitalize text-xl italic text-left"
                type="button"
                onClick={selectRecipe}
              >
                {recipe.title}
              </button>
            </div>
          </div>
          <div>
            <div className="pt-1">
              {recipe.categories.length > 0 && (
                <div className="text-xs flex">
                  {recipe.categories.map((category, idx) => (
                    <button
                      type="button"
                      key={category}
                      className="capitalize mr-1"
                      onClick={() => handleCategoryChange({ target: { value: category } })}
                    >
                      {category}
                      {idx + 1 < recipe.categories.length ? ',' : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RecipeListItem.propTypes = {
  recipe: PropTypes.shape({
    image: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    favorite: PropTypes.bool,
    originalURL: PropTypes.string,
    source: PropTypes.string,
    onShoppingList: PropTypes.bool,
    ingredients: PropTypes.arrayOf(PropTypes.shape({})),
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleCategoryChange: PropTypes.func.isRequired,
  getRecipes: PropTypes.func.isRequired,
};
