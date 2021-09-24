import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingListByRecipe from '../ShoppingListByRecipe';
import { updateRecipe, getRecipeById } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function ShoppingListHolder({ recipesOnShoppingList, getShoppingListRecipes }) {
  const history = useHistory();
  const [recipesNames, setRecipesNames] = useState([]);
  const [{ db, currentUser, setRecipeId, setRecipe }] = useContext(Context);

  const defineRecipeNames = () => {
    const recipesNamesTemp = [];
    recipesOnShoppingList.forEach((recipe) => {
      recipesNamesTemp.push({ recipeTitle: recipe.title, id: recipe.id });
    });
    setRecipesNames([...recipesNamesTemp]);
  };

  const removeFromShoppingList = async (data) => {
    await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: data.id,
      payload: {
        onShoppingList: false,
      },
    });
    getShoppingListRecipes();
  };

  const goToRecipe = async (data) => {
    const recipeById = await getRecipeById({
      db,
      currentUserId: currentUser.uid,
      payload: { id: data.id },
    });

    setRecipe(recipeById);
    setRecipeId(recipeById.id);
    history.push(`/recipe`);
  };

  useEffect(() => {
    defineRecipeNames();
  }, [recipesOnShoppingList]);

  return (
    <div>
      <div className="mx-3 mb-5">
        <div className="text-5xl pt-1 mr-12 uppercase pt-9">Shopping List</div>
      </div>
      <div className="lg:flex flex-row">
        <div className="lg:w-3/12 pr-10">
          {recipesNames.length > 0 && (
            <div className="flex-grow">
              {recipesNames.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="flex justify-between center-align hover:bg-gray-200 w-full m-h-10 p-2"
                >
                  <button
                    type="button"
                    className="w-10/12 my-1 ml-1 text-left"
                    onClick={() => goToRecipe({ id: rec.id })}
                  >
                    {rec.recipeTitle}
                  </button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CloseIcon
                        type="button"
                        className="w-1/12 cursor-pointer mr-5"
                        onClick={() => removeFromShoppingList({ id: rec.id, idx })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:w-9/12 mt-8 lg:mt-0 px-3 lg:px-0">
          <div className="bg-gray-300 h-px lg:w-0 w-full mb-8 lg:mb-2" />
          {recipesOnShoppingList.map((recipe) => (
            <ShoppingListByRecipe
              key={recipe.id}
              recipeData={recipe}
              getShoppingListRecipes={getShoppingListRecipes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

ShoppingListHolder.propTypes = {
  recipesOnShoppingList: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
    }),
  ).isRequired,
  getShoppingListRecipes: PropTypes.func.isRequired,
};
