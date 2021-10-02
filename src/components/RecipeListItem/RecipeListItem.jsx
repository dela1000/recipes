import { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import {
  recipeState,
  dbState,
  currentUserState,
  allRecipesState,
  numberOfItemsOnShoppingListState,
} from '../../contexts/atoms/atoms';
import IconButton from '../IconButton';
import { updateRecipe } from '../../adapters/recipeAdapters';

export default function RecipeListItem({ recipe, handleCategoryChange }) {
  const setRecipe = useSetRecoilState(recipeState);
  const [updatingFavorite, setUpdatingFavorite] = useState(false);
  const [updatingShopping, setUpdatingShopping] = useState(false);
  const [allRecipes, setAllRecipes] = useRecoilState(allRecipesState);
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const [numberOfItemsOnShoppingList, setNumberOfItemsOnShoppingList] = useRecoilState(
    numberOfItemsOnShoppingListState,
  );

  const history = useHistory();

  const navigate = () => {
    history.push('/recipe');
  };

  const selectRecipe = () => {
    setRecipe(recipe);
    navigate();
  };

  const updateAllRecipes = (updatedRecipe) => {
    const recipeFoundInAllRecipesIndex = allRecipes.findIndex(
      (element) => element.id === recipe.id,
    );
    const parsedAllRecipes = JSON.parse(JSON.stringify(allRecipes));
    parsedAllRecipes[recipeFoundInAllRecipesIndex] = updatedRecipe;
    setAllRecipes(parsedAllRecipes);
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
    updateAllRecipes(updatedRecipe);
    setUpdatingFavorite(false);
  };

  const handleAddToShoppingList = async () => {
    setUpdatingShopping(true);

    const dataToUpdate = {
      onShoppingList: !recipe.onShoppingList,
    };

    let itemsToRemove = 0;
    const parsedRecipe = JSON.parse(JSON.stringify(recipe));
    parsedRecipe.ingredients.forEach((ingredientsGroup) => {
      itemsToRemove += ingredientsGroup.ingredients.length;
      ingredientsGroup.ingredients.forEach((ingredient) => {
        ingredient.purchased = false;
      });
    });

    dataToUpdate.ingredients = parsedRecipe.ingredients;

    const updatedRecipe = await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: parsedRecipe.id,
      payload: dataToUpdate,
    });

    if (dataToUpdate.onShoppingList) {
      setNumberOfItemsOnShoppingList(numberOfItemsOnShoppingList + itemsToRemove);
    } else {
      setNumberOfItemsOnShoppingList(numberOfItemsOnShoppingList - itemsToRemove);
    }
    updateAllRecipes(updatedRecipe);
    setUpdatingShopping(false);
  };
  return (
    <div key={recipe.id} className={recipe.deleted ? 'hidden' : 'block'}>
      <hr />
      <div className="flex">
        <div className="mt-3 mx-1">
          <div className="lg:flex flex-col">
            <div className="mb-1">
              <IconButton
                type="favorite"
                itemToUpdate={recipe.favorite}
                updating={updatingFavorite}
                handleFunction={handleFavoriteSelected}
              />
            </div>
          </div>
          <div>
            <IconButton
              type="onShoppingList"
              itemToUpdate={recipe.onShoppingList}
              updating={updatingShopping}
              handleFunction={handleAddToShoppingList}
            />
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
              <div className="w-32 h-32 bg-gray-200" />
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
            <div className="flex-initial mr-5">
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
    deleted: PropTypes.bool,
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
};
