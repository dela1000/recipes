import PropTypes from 'prop-types';

export default function RecipeInstructions({ recipe }) {
  return (
    <div className="my-5 mb-20 pl-3 lg:pl-0">
      <div className="my-5 pl-3 lg:pl-0">
        <div className="mt-5 mb-2 text-2xl">INSTRUCTIONS</div>
        {recipe.instructions.map((item) => (
          <div key={item.index}>
            {item.instructions.length > 0 && (
              <div className="text-1xl font-bold capitalize">{item.groupName}</div>
            )}
            {item.instructions.map((instruction) => (
              <div className="mb-2" key={instruction}>
                <span>{instruction}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

RecipeInstructions.propTypes = {
  recipe: PropTypes.shape({
    instructions: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};
