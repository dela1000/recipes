import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import FavoriteButton from '../FavoriteButton';
import AddToShoppingListButton from '../AddToShoppingListButton';
import { updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function RecipeListItem({ recipe, handleCategoryChange, updateSingleRecipe }) {
  const [listRecipe, setListRecipe] = useState({
    id: null,
    favorite: null,
    image: null,
    originalURL: null,
    source: null,
    title: null,
    onShoppingList: null,
    categories: [],
  });
  const [updatingFavorite, setUpdatingFavorite] = useState(false);
  const [updatingShopping, setUpdatingShopping] = useState(false);
  const [{ db, currentUser, setRecipeId, setRecipe }] = useContext(Context);
  const history = useHistory();
  const navigate = () => {
    history.push('/recipe');
  };

  const selectRecipe = () => {
    setRecipe(recipe);
    setRecipeId(listRecipe.id);
    navigate();
  };

  const handleFavoriteSelected = async () => {
    setUpdatingFavorite(true);
    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: listRecipe.id,
      payload: {
        favorite: !listRecipe.favorite,
      },
    });
    setUpdatingFavorite(false);
    setListRecipe(updatedRecipe);
    updateSingleRecipe(listRecipe.id);
  };

  const handleAddToShoppingList = async () => {
    setUpdatingShopping(true);
    const dataToUpdate = {
      onShoppingList: !listRecipe.onShoppingList,
    };

    if (listRecipe.onShoppingList) {
      listRecipe.ingredients.forEach((ingredientsGroup) => {
        ingredientsGroup.ingredients.forEach((ingredient) => {
          ingredient.purchased = false;
        });
      });
    }

    dataToUpdate.ingredients = listRecipe.ingredients;

    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: listRecipe.id,
      payload: dataToUpdate,
    });
    setUpdatingShopping(false);
    setListRecipe(updatedRecipe);
    updateSingleRecipe(listRecipe.id);
  };

  useEffect(() => {
    setListRecipe(recipe);
  }, []);

  return (
    <div key={listRecipe.id}>
      <hr />
      <div className="flex">
        <div className="mt-3 mx-1">
          <div className="lg:flex flex-col">
            <div className="mb-1">
              <FavoriteButton
                favorite={listRecipe.favorite}
                updating={updatingFavorite}
                handleFavoriteSelected={handleFavoriteSelected}
              />
            </div>
            <div>
              <AddToShoppingListButton
                onShoppingList={listRecipe.onShoppingList}
                updating={updatingShopping}
                handleAddToShoppingList={handleAddToShoppingList}
              />
            </div>
          </div>
        </div>
        <div className="flex-initial mt-3 mr-3">
          <button type="button" onClick={selectRecipe} className="w-32 h-32">
            {listRecipe.image ? (
              <img
                src={listRecipe.image}
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
                href={listRecipe.originalURL}
                target="_blank"
                rel="noreferrer"
              >
                {listRecipe.source}
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
                {listRecipe.title}
              </button>
            </div>
          </div>
          <div>
            <div className="pt-1">
              {listRecipe.categories.length > 0 && (
                <div className="text-xs flex">
                  {listRecipe.categories.map((category, idx) => (
                    <button
                      type="button"
                      key={category}
                      className="capitalize mr-1"
                      onClick={() => handleCategoryChange({ target: { value: category } })}
                    >
                      {category}
                      {idx + 1 < listRecipe.categories.length ? ',' : null}
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
  updateSingleRecipe: PropTypes.func.isRequired,
};
