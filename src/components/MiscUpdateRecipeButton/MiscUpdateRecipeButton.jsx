import PropTypes from 'prop-types';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import StarIcon from '@material-ui/icons/Star';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

export default function MiscUpdateRecipeButton({ type, itemToUpdate, updating, handleFunction }) {
  return (
    <button
      className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-14 mx-1 h-9"
      type="button"
      onClick={handleFunction}
    >
      {updating ? (
        <AutorenewIcon fontSize="small" className="animate-spin" />
      ) : (
        <div>
          {type === 'favorite' && (
            <StarIcon
              fontSize="small"
              className={`${itemToUpdate ? `text-yellow-400` : 'text-white'} fill-current`}
            />
          )}
          {type === 'onShoppingList' && (
            <ShoppingCartIcon
              fontSize="small"
              className={`${itemToUpdate ? `text-yellow-400` : 'text-white'} fill-current`}
            />
          )}
        </div>
      )}
    </button>
  );
}

MiscUpdateRecipeButton.propTypes = {
  type: PropTypes.string.isRequired,
  itemToUpdate: PropTypes.bool,
  updating: PropTypes.bool.isRequired,
  handleFunction: PropTypes.func.isRequired,
};

MiscUpdateRecipeButton.defaultProps = {
  itemToUpdate: false,
};
