import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function AddRecipeButton({ text }) {
  const history = useHistory();

  return (
    <button
      type="button"
      className="uppercase monserrat"
      onClick={() => history.push(`/addrecipe`)}
    >
      {text}
    </button>
  );
}

AddRecipeButton.propTypes = {
  text: PropTypes.string,
};

AddRecipeButton.defaultProps = {
  text: 'add new recipe',
};
