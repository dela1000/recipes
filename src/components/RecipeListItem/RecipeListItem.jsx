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
    <div className="h-14" key={recipe.id}>
      <hr />
      <div className="flex justify-start pt-2">
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
        <div className="pl-2">
          {recipe.favorite && (
            <StarIcon fontSize="small" className="fill-current text-yellow-400" />
          )}
        </div>
      </div>
      <div className="text-xs">
        {recipe.categories.map((category) => (
          <div key={category} className="capitalize">
            {category}
          </div>
        ))}
      </div>
    </div>
  );
}

RecipeListItem.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    favorite: PropTypes.bool,
    categories: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
