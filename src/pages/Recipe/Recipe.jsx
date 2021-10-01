import { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useRecoilValue } from 'recoil';
import { recipeState } from '../../contexts/atoms/atoms';
import RecipeInfo from '../../components/RecipeInfo';
import RecipeOptions from '../../components/RecipeOptions';
// import RecipeIngredients from '../../components/RecipeIngredients';
// import RecipeInstructions from '../../components/RecipeInstructions';

export default function Recipe() {
  const recipe = useRecoilValue(recipeState);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fade-in">
      {!isEmpty(recipe) && (
        <div>
          <RecipeInfo />
          <RecipeOptions />
          <hr className="mt-3" />
          {/* <div className="lg:flex flex-row mx-4">
            <div className="lg:w-3/12 pr-20">
              <RecipeIngredients recipe={recipe} />
            </div>
            <div className="lg:w-9/12">
              {recipe.instructions && <RecipeInstructions recipe={recipe} />}
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
