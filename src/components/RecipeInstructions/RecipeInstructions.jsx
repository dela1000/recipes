import PropTypes from 'prop-types';

export default function RecipeInstructions({ recipe }) {
  const instructionsHeaders = Object.keys(recipe.instructions);

  return (
    <div className="my-5">
      {recipe.instructions && <div className="mt-5 mb-2 text-2xl">Instructions:</div>}
      {instructionsHeaders.map((header) => (
        <div key={header} className="px-4">
          {recipe.instructions[header].length > 0 && (
            <div className="text-1xl font-bold capitalize">{header}</div>
          )}
          <div className="mb-3">
            {recipe.instructions[header].map((ingredient) => (
              <div key={ingredient}>{ingredient}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

RecipeInstructions.propTypes = {
  recipe: PropTypes.shape({
    instructions: PropTypes.shape({
      standard: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
  }).isRequired,
};
