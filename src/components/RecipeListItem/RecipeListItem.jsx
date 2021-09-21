import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';

import { Context } from '../../contexts/context';

export default function RecipeListItem({ recipe, handleCategoryChange }) {
  const [{ setRecipeId, setRecipe }] = useContext(Context);
  const history = useHistory();
  const navigate = () => {
    history.push('/recipe');
  };

  const selectRecipe = () => {
    setRecipe(recipe);
    setRecipeId(recipe.id);
    navigate();
  };

  return (
    <div key={recipe.id}>
      <hr />
      <div className="flex">
        <div className="flex-initial mt-3 ml-3 mr-3">
          <div className="absolute">
            {recipe.favorite && <StarIcon fontSize="large" className="text-yellow-400" />}
          </div>
          <button type="button" onClick={selectRecipe} className="w-32 h-32">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt="food"
                className="object-cover min-h-full min-w-full w-32 h-32"
              />
            ) : (
              <div className="h-20 w-20 bg-gray-200" />
            )}
          </button>
        </div>
        <div className="flex-initial mt-6">
          <div>
            <div>
              <a
                className="text-xs text-blue-400"
                href={recipe.originalURL}
                target="_blank"
                rel="noreferrer"
              >
                {recipe.source}
              </a>
            </div>
          </div>
          <div className="flex">
            <div className="flex-initial">
              <button
                className="capitalize text-xl italic text-left"
                type="button"
                onClick={selectRecipe}
              >
                {recipe.title}
              </button>
            </div>
          </div>
          <div>
            <div className="pt-1">
              {recipe.categories.length > 0 && (
                <div className="text-xs flex">
                  {recipe.categories.map((category, idx) => (
                    <button
                      type="button"
                      key={category}
                      className="capitalize mr-1"
                      onClick={() => handleCategoryChange({ target: { value: category } })}
                    >
                      {category}
                      {idx + 1 < recipe.categories.length ? ',' : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RecipeListItem.propTypes = {
  recipe: PropTypes.shape({
    image: PropTypes.string,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    favorite: PropTypes.bool,
    originalURL: PropTypes.string,
    source: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleCategoryChange: PropTypes.func.isRequired,
};
