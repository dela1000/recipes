import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';

import { Context } from '../../contexts/context';

export default function RecipeListItem({ recipe }) {
  const [{ setRecipeId, setRecipe }] = useContext(Context);
  const history = useHistory();
  const navigate = () => {
    history.push('/recipe');
  };

  return (
    <div className="h-24" key={recipe.id}>
      <hr />
      <div className="flex pt-2">
        <div>
          {recipe.image ? (
            <img
              src={recipe.image}
              alt="food"
              className="inline object-cover max-h-20 w-20 bg-gray-200"
            />
          ) : (
            <div className="h-20 w-20 bg-gray-200" />
          )}
        </div>
        <div className="ml-2">
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
          <button
            className="capitalize text-xl italic"
            type="button"
            onClick={() => {
              setRecipe(recipe);
              setRecipeId(recipe.id);
              navigate();
            }}
          >
            {recipe.title}
          </button>
          <div className="text-xs">
            {recipe.categories.map((category) => (
              <div key={category} className="capitalize">
                {category}
              </div>
            ))}
          </div>
        </div>
        <div className="pl-2">
          {recipe.favorite && (
            <StarIcon fontSize="small" className="fill-current text-yellow-400" />
          )}
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
};
