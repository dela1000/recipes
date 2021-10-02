import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { useRecoilValue } from 'recoil';
import { recipeState } from '../../contexts/atoms/atoms';

export default function RecipeInfo() {
  const history = useHistory();
  const recipe = useRecoilValue(recipeState);

  const goBackHome = () => {
    history.push(`/`);
  };

  useEffect(() => {
    if (isEmpty(recipe)) goBackHome();
  }, []);

  return (
    <div className="md:flex">
      <div className="flex">
        <div className="lg:pl-1 h-72 w-72 m-auto">
          {recipe.image && (
            <img
              src={recipe.image}
              alt="food"
              className="object-cover min-h-full min-w-fill h-72 w-72 bg-gray-200"
            />
          )}
        </div>
      </div>
      <div className="w-full ml-4">
        <div className="mt-4 pl-3 lg:pl-0">
          {recipe.originalURL && (
            <div className="mt-4">
              <a
                className="text-xs text-blue-400 uppercase"
                href={recipe.originalURL}
                target="_blank"
                rel="noreferrer"
              >
                {recipe.source}
              </a>
            </div>
          )}
          <div className="mb-3">
            <div className="flex">
              <div className="flex justify-start mr-5 lg:mr-0">
                <div>
                  <div className="text-3xl mb-2 capitalize italic">{recipe.title}</div>
                  {recipe?.categories?.length > 0 && (
                    <div className="text-xs flex">
                      {recipe.categories.map((category, idx) => (
                        <div key={category} className="capitalize mr-1">
                          {category}
                          {idx + 1 < recipe.categories.length ? ',' : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-4/5">
            {recipe.description && (
              <div className="mb-2">
                <b className="uppercase">Description</b> {recipe.description}
              </div>
            )}
            {recipe.yield && (
              <div className="mb-2">
                <b className="uppercase">Yield </b>
                {recipe.yield}
              </div>
            )}
            {recipe.active && (
              <div className="mb-2">
                <b className="uppercase">Active Time </b>
                {recipe.active}
              </div>
            )}
            {recipe.totalTime && (
              <div className="mb-2">
                <b className="uppercase">Total Time </b> {recipe.totalTime}
              </div>
            )}
            {recipe.notes && (
              <div className="mb-2">
                <b className="uppercase">Notes </b>
                <div>{recipe.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
