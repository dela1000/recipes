import PropTypes from 'prop-types';

export default function RecipeInstructions({ recipe }) {
  const instructionsHeaders = Object.keys(recipe.instructions);

  return (
    <div className="my-5 mb-20 pl-3 lg:pl-0">
      {recipe.instructions.standard.length > 0 ||
        (instructionsHeaders.length > 1 && <div className="mt-5 mb-2 text-2xl">INSTRUCTIONS</div>)}
      {instructionsHeaders.map((header) => (
        <div key={header} className="px-4">
          {recipe.instructions[header].length > 0 && (
            <div className="text-1xl font-bold capitalize">{header}</div>
          )}
          <div className="mb-3 pr-10">
            {recipe.instructions[header].map((instructions, idx) => (
              <div key={instructions} className="mb-4">
                <div className="flex">
                  <div className="font-bold mr-3">{idx + 1}</div>
                  <div>{instructions}</div>
                </div>
                <hr className="mt-4" />
              </div>
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
