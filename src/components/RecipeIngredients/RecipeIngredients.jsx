import PropTypes from 'prop-types';

export default function RecipeIngredients({ recipe }) {
  const ingredientsHeaders = Object.keys(recipe.ingredients);

  return (
    <div className="my-5">
      {recipe.ingredients && <div className="mt-5 mb-2 text-2xl">Ingredients:</div>}
      {ingredientsHeaders.map((header) => (
        <div key={header} className="px-4">
          {recipe.ingredients[header].length > 0 && (
            <div className="text-1xl font-bold">{header}</div>
          )}
          <div className="mb-3">
            {recipe.ingredients[header].map((ingredient) => (
              <div key={ingredient}>{ingredient}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

RecipeIngredients.propTypes = {
  recipe: PropTypes.shape({
    ingredients: PropTypes.shape({
      standard: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
  }).isRequired,
};
