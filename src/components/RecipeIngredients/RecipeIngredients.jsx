import PropTypes from 'prop-types';

export default function RecipeIngredients({ recipe }) {
  const ingredientsHeaders = Object.keys(recipe.ingredients);

  return (
    <div className="my-5 pl-3 lg:pl-0">
      {recipe.ingredients && <div className="mt-5 mb-2 text-2xl">INGREDIENTS</div>}
      {ingredientsHeaders.map((header) => (
        <div key={header} className="px-4">
          {recipe.ingredients[header].length > 0 && (
            <div className="text-1xl font-bold capitalize">{header}</div>
          )}
          <div className="mb-3">
            {recipe.ingredients[header].map((ingredient) => (
              <div className="mb-2" key={ingredient.string}>
                {ingredient.quantity && (
                  <span className="mr-2 font-bold">{ingredient.quantity}</span>
                )}
                <span>{ingredient.string}</span>
              </div>
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
      standard: PropTypes.arrayOf(
        PropTypes.shape({ quantity: PropTypes.string, string: PropTypes.string }),
      ),
    }),
  }).isRequired,
};
