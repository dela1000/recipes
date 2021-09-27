import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import RecipeInfo from '../../components/RecipeInfo';
import RecipeOptions from '../../components/RecipeOptions';
import RecipeIngredients from '../../components/RecipeIngredients';
import RecipeInstructions from '../../components/RecipeInstructions';
import { Context } from '../../contexts/context';

import { getRecipeById } from '../../adapters/recipeAdapters';

export default function Home() {
  const [{ db, currentUser, recipeId }] = useContext(Context);
  const [recipe, setRecipe] = useState();
  const history = useHistory();

  const getRecipe = async () => {
    const recipeById = await getRecipeById({
      db,
      currentUserId: currentUser.uid,
      payload: { id: recipeId },
    });
    setRecipe(recipeById);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isEmpty(recipeId)) {
      history.push('/');
    }
    getRecipe();
  }, []);

  return (
    <div className="fade-in">
      {!isEmpty(recipe) && (
        <div>
          <RecipeInfo recipe={recipe} />
          <RecipeOptions recipe={recipe} />
          <hr className="mt-3" />
          <div className="lg:flex flex-row mx-4">
            <div className="lg:w-3/12 pr-20">
              <RecipeIngredients recipe={recipe} />
            </div>
            <div className="lg:w-9/12">
              {recipe.instructions && <RecipeInstructions recipe={recipe} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
