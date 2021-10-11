import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';
import { dbState, currentUserState } from '../../contexts/atoms/atoms';
import ShoppingListRecipeIngredientGroup from '../ShoppingListRecipeIngredientGroup';

import { updateRecipe } from '../../adapters/recipeAdapters';

export default function ShoppingListByRecipe({ recipeData, getShoppingListRecipes }) {
  const [currentRecipe, setCurrentRecipe] = useState({});
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);

  const updateShoppingListRecipe = async () => {
    await updateRecipe({
      db,
      currentUserId: currentUser.uid,
      recipeId: currentRecipe.id,
      payload: currentRecipe,
    });
    getShoppingListRecipes();
  };

  useEffect(() => {
    const parsedRecipe = JSON.parse(JSON.stringify(recipeData));
    setCurrentRecipe(parsedRecipe);
  }, [recipeData]);

  return (
    <div>
      <div className="text-xl mb-2 capitalize italic">{currentRecipe.title}</div>
      <div className="mb-5 -ml-2.5">
        {currentRecipe?.ingredients?.map((ingredientsGroup) => (
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
