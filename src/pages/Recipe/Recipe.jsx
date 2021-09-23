import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import RecipeInfo from '../../components/RecipeInfo';
import RecipeIngredients from '../../components/RecipeIngredients';
import RecipeInstructions from '../../components/RecipeInstructions';
import { Context } from '../../contexts/context';

export default function Home() {
  const [{ recipe }] = useContext(Context);
  const history = useHistory();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isEmpty(recipe)) {
      history.push('/');
    }
  }, []);
  console.log('+++ 19: src/pages/Recipe/Recipe.jsx - recipe: ', JSON.stringify(recipe, null, 4));
  return (
    <div className="fade-in">
      {!isEmpty(recipe) && (
        <div>
          <RecipeInfo recipe={recipe} />
          <hr className="mt-6" />
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
