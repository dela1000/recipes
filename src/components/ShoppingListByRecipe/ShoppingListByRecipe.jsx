import { useContext } from 'react';
import PropTypes from 'prop-types';
import ShoppingListRecipeIngredientGroup from '../ShoppingListRecipeIngredientGroup';

import { updateRecipe } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function ShoppingListByRecipe({ recipeData, getShoppingListRecipes }) {
  const [{ db, currentUser }] = useContext(Context);

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
      <div className="text-xl mb-2 capitalize italic">{recipeData.title}</div>
      <div className="mb-5 pl-3 lg:pl-0">
        {recipeData.ingredients.map((ingredientsGroup) => (
          <ShoppingListRecipeIngredientGroup
            key={ingredientsGroup.index}
            updateShoppingListRecipe={updateShoppingListRecipe}
            ingredientsGroup={ingredientsGroup}
          />
        ))}
      </div>
    </div>
  );
}
ShoppingListByRecipe.propTypes = {
  recipeData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  getShoppingListRecipes: PropTypes.func.isRequired,
};
