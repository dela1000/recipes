import PropTypes from 'prop-types';

export default function TextButton({ text, handleFunction }) {
  return (
    <button
      className="uppercase px-4 py-2 text-xs bg-gray-600 text-blue-100 hover:bg-gray-600 duration-300 mx-1 h-9"
      type="button"
      onClick={handleFunction}
    >
      {text}
    </button>
  );
}

TextButton.propTypes = {
  text: PropTypes.string.isRequired,
  handleFunction: PropTypes.func.isRequired,
};
