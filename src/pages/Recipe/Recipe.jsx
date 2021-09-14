import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import RecipeInfo from '../../components/RecipeInfo/index';
import RecipeIngredients from '../../components/RecipeIngredients/index';
import RecipeInstructions from '../../components/RecipeInstructions/index';
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
      <RecipeInfo recipe={recipe} />
      <RecipeIngredients recipe={recipe} />
      <RecipeInstructions recipe={recipe} />
    </div>
  );
}
