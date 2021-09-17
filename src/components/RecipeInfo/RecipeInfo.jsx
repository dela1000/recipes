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
    <div className="md:flex pt-8">
      {recipe.image && (
        <img
          src={recipe.image}
          alt="food"
          className="object-cover min-h-full min-w-fill h-72 w-72 bg-gray-200 mr-8"
        />
      )}
      <div className="w-full">
        <div>
          <a
            className="text-xs text-blue-400 uppercase"
            href={recipe.originalURL}
            target="_blank"
            rel="noreferrer"
          >
            {recipe.source}
          </a>
        </div>
        <div className="mb-3">
          <div className="flex">
            <div className="flex justify-start mt-5">
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
          {recipe.total && (
            <div className="mb-2">
              <b className="uppercase">Total</b> {recipe.total}
            </div>
          )}
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
    total: PropTypes.string,
    image: PropTypes.string,
    favorite: PropTypes.bool,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
