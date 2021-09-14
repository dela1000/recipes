import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from '../../contexts/context';
import recipesData from '../../adapters/recipesData';

export default function RecipesList() {
  const history = useHistory();
  const [{ setRecipeId, setRecipe }] = useContext(Context);

  const navigate = () => {
    history.push(`/recipe`);
  };

  return (
    <div>
      <div className="text-3xl mb-5">RECIPES</div>
      {recipesData.map((recipe) => (
        <div key={recipe.id}>
          <button
            className="uppercase"
            type="button"
            onClick={() => {
              setRecipe(recipe);
              setRecipeId(recipe.id);
              navigate();
            }}
          >
            {recipe.title}
          </button>
        </div>
      ))}
    </div>
  );
}
