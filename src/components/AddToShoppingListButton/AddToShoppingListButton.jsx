import PropTypes from 'prop-types';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AutorenewIcon from '@material-ui/icons/Autorenew';

export default function AddToShoppingListButton({
  onShoppingList,
  updating,
  handleAddToShoppingList,
}) {
  return (
    <button
      className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-14 mx-1 h-9"
      type="button"
      onClick={handleAddToShoppingList}
    >
      {updating ? (
        <AutorenewIcon fontSize="small" className="animate-spin" />
      ) : (
        <ShoppingCartIcon
          fontSize="small"
          className={`${onShoppingList ? `text-yellow-400` : 'text-white'} fill-current`}
        />
      )}
    </button>
  );
}

AddToShoppingListButton.propTypes = {
  onShoppingList: PropTypes.bool,
  updating: PropTypes.bool.isRequired,
  handleAddToShoppingList: PropTypes.func.isRequired,
};

AddToShoppingListButton.defaultProps = {
  onShoppingList: false,
};
