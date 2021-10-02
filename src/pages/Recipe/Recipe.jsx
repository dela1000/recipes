import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { useRecoilValue } from 'recoil';
import { recipeState, allRecipesState } from '../../contexts/atoms/atoms';
import RecipeInfo from '../../components/RecipeInfo';
import RecipeOptions from '../../components/RecipeOptions';
import RecipeIngredients from '../../components/RecipeIngredients';
import RecipeInstructions from '../../components/RecipeInstructions';

export default function Recipe() {
  const history = useHistory();
  const recipe = useRecoilValue(recipeState);
  const allRecipe = useRecoilValue(allRecipesState);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (allRecipe.length === 0) {
      history.push('/');
    }
  }, [recipe]);

  return (
    <div className="fade-in">
      {!isEmpty(recipe) && (
        <div>
          <RecipeInfo />
          <RecipeOptions />
          <hr className="mt-3" />
          <div className="lg:flex flex-row mx-4">
            <div className="lg:w-3/12 pr-20">
              <RecipeIngredients />
            </div>
            <div className="lg:w-9/12">{recipe.instructions && <RecipeInstructions />}</div>
          </div>
        </div>
      )}
    </div>
  );
}
