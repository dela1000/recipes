import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import StarIcon from '@material-ui/icons/Star';

export default function RecipeInfo({ recipe }) {
  const history = useHistory();

  const goBackHome = () => {
    history.push(`/`);
  };

  useEffect(() => {
    if (isEmpty(recipe)) goBackHome();
  }, []);

  return (
    <div className="md:flex">
      <div className="flex">
        <div className="h-72 w-72 m-auto">
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
                  {recipe.categories.length > 0 && (
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
                {recipe.favorite && (
                  <div className="pt-1 pl-2">
                    <StarIcon className="fill-current text-yellow-400" />
                  </div>
                )}
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

RecipeInfo.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    source: PropTypes.string,
    originalURL: PropTypes.string,
    yield: PropTypes.string,
    active: PropTypes.string,
    totalTime: PropTypes.string,
    image: PropTypes.string,
    notes: PropTypes.string,
    favorite: PropTypes.bool,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
