import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Star';
import AutorenewIcon from '@material-ui/icons/Autorenew';

export default function FavoriteButton({ favorite, updating, handleFavoriteSelected }) {
  return (
    <button
      className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 w-14 mx-1 h-9"
      type="button"
      onClick={handleFavoriteSelected}
    >
      {updating ? (
        <AutorenewIcon fontSize="small" className="animate-spin" />
      ) : (
        <StarIcon
          fontSize="small"
          className={`${favorite ? `text-yellow-400` : 'text-white'} fill-current`}
        />
      )}
    </button>
  );
}

FavoriteButton.propTypes = {
  favorite: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  handleFavoriteSelected: PropTypes.func.isRequired,
};
