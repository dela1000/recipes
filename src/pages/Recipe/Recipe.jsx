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
      history.push(`/`);
    }
  }, []);

  return (
    <div className="fade-in">
      {!isEmpty(recipe) && (
        <div>
          <RecipeInfo recipe={recipe} />
          <div className="lg:flex flex-row">
            <RecipeIngredients recipe={recipe} />
            <RecipeInstructions recipe={recipe} />
          </div>
        </div>
      )}
    </div>
  );
}
