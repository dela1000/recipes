import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Context } from '../../contexts/context';

export default function RecipesList() {
  const history = useHistory();
  const [{ recipe }] = useContext(Context);

  const goBackHome = () => {
    history.push(`/`);
  };

  useEffect(() => {
    if (isEmpty(recipe)) goBackHome();
  }, []);

  const ingredientsHeaders = Object.keys(recipe.ingredients);
  const instructionsHeaders = Object.keys(recipe.instructions);

  return (
    <div className="my-5">
      <div className="text-3xl mb-5">{recipe.title}</div>
      {recipe.description && <div className="mb-2">Description: {recipe.description}</div>}
      {recipe.source && <div className="mb-2">Source: {recipe.source}</div>}
      {recipe.originalURL && <div className="mb-2">Original URL: {recipe.originalURL}</div>}
      {recipe.yield && <div className="mb-2">Yield: {recipe.yield}</div>}
      {recipe.active && <div className="mb-2">Active time: {recipe.active}</div>}
      {recipe.total && <div className="mb-2">Total: {recipe.total}</div>}
      {recipe.ingredients && <div className="mt-5 mb-2 text-2xl">Ingredients:</div>}
      {ingredientsHeaders.map((header) => (
        <div>
          {recipe.ingredients[header].length > 0 && (
            <div key={header} className="text-1xl font-bold">
              {header}
            </div>
          )}
          <div>
            {recipe.ingredients[header].map((ingredient) => (
              <div key={ingredient}>{ingredient}</div>
            ))}
          </div>
        </div>
      ))}

      {recipe.instructions && <div className="mt-5 mb-2 text-2xl">Instructions:</div>}
      {instructionsHeaders.map((header) => (
        <div>
          {recipe.instructions[header].length > 0 && (
            <div key={header} className="text-1xl font-bold">
              {header}
            </div>
          )}
          <div>
            {recipe.instructions[header].map((instruction) => (
              <div key={instruction}>{instruction}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
