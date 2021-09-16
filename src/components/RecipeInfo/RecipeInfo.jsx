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
    <div className="md:flex py-8">
      <img
        src={recipe.image}
        alt="food"
        className="inline object-cover max-h-72 w-72 bg-gray-200"
      />
      <div className="ml-8 w-full">
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
        <div>
          <div className="flex justify-between">
            <div className="flex justify-start">
              <div className="text-3xl mb-5 capitalize italic">{recipe.title}</div>
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
          {recipe.source && (
            <div className="mb-2">
              <b className="uppercase">Source</b> {recipe.source}
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
  }).isRequired,
};
