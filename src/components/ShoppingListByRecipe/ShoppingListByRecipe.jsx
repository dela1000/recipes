import { useContext } from 'react';
import PropTypes from 'prop-types';
import ShoppingListItem from '../ShoppingListItem';
import { updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function ShoppingListByRecipe({ recipeData, getShoppingListRecipes }) {
  const [{ db, currentUser }] = useContext(Context);

  const ingredientsHeaders = Object.keys(recipeData.ingredients);

  const updateShoppingListRecipe = async () => {
    await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: recipeData.id,
      payload: recipeData,
    });
    getShoppingListRecipes();
  };

  return (
    <div>
      <button type="button" onClick={() => test()}>
        Test
      </button>
      <div className="text-xl mb-2 capitalize italic">{recipeData.title}</div>
      <div className="mb-5 pl-3 lg:pl-0">
        {ingredientsHeaders.map((header) => (
          <div key={header}>
            <div className="mb-3">
              {recipeData.ingredients[header].map((ingredient) => (
                <ShoppingListItem
                  key={ingredient.string}
                  updateShoppingListRecipe={updateShoppingListRecipe}
                  ingredient={ingredient}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
ShoppingListByRecipe.propTypes = {
  recipeData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ingredients: PropTypes.shape({}).isRequired,
  }).isRequired,
  getShoppingListRecipes: PropTypes.func.isRequired,
};
