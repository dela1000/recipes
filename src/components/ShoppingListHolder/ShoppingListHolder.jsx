import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ShoppingListByRecipe from '../ShoppingListByRecipe';
import { updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function ShoppingListHolder({ recipesOnShoppingList, getShoppingListRecipes }) {
  const [recipesNames, setRecipesNames] = useState([]);
  const [{ db, currentUser }] = useContext(Context);

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

  useEffect(() => {
    defineRecipeNames();
  }, [recipesOnShoppingList]);

  return (
    <div>
      <div className="mx-3 mb-5">
        <div className="text-5xl pt-1 mr-12 uppercase pt-9">Shopping List</div>
      </div>
      <div className="lg:flex flex-row mx-4">
        <div className="lg:w-3/12 pr-10">
          {recipesNames.length > 0 && (
            <div className="flex-grow">
              {recipesNames.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="flex justify-between center-align hover:bg-gray-200 w-full m-h-10 p-2"
                >
                  <div className="w-10/12">{rec.recipeTitle}</div>
                  <button
                    type="button"
                    className="w-1/12"
                    onClick={() => removeFromShoppingList({ id: rec.id, idx })}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:w-9/12 mt-8 lg:mt-0">
          {recipesOnShoppingList.map((recipe) => (
            <ShoppingListByRecipe key={recipe.id} recipeData={recipe} />
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
