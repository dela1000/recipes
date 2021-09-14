import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

export default function RecipeInfo({ recipe }) {
  const history = useHistory();

  const goBackHome = () => {
    history.push(`/`);
  };

  useEffect(() => {
    if (isEmpty(recipe)) goBackHome();
  }, []);

  return (
    <div className="my-5">
      <div className="flex justify-between">
        <div className="text-3xl mb-5">{recipe.title}</div>
        <ArrowLeftIcon className="cursor-pointer" fontSize="large" onClick={() => goBackHome()} />
      </div>
      {recipe.description && <div className="mb-2">Description: {recipe.description}</div>}
      {recipe.source && <div className="mb-2">Source: {recipe.source}</div>}
      {recipe.originalURL && (
        <div className="mb-2">
          Original URL:{' '}
          <a href={recipe.originalURL} target="_blank" rel="noreferrer">
            {recipe.originalURL}
          </a>
        </div>
      )}
      {recipe.yield && <div className="mb-2">Yield: {recipe.yield}</div>}
      {recipe.active && <div className="mb-2">Active time: {recipe.active}</div>}
      {recipe.total && <div className="mb-2">Total: {recipe.total}</div>}
    </div>
  );
}

RecipeInfo.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    source: PropTypes.string,
    originalURL: PropTypes.string,
    yield: PropTypes.number,
    active: PropTypes.string,
    total: PropTypes.string,
  }).isRequired,
};
