import PropTypes from 'prop-types';

export default function RecipeIngredients({ recipe }) {
  return (
    <div className="my-5 pl-3 lg:pl-0">
      <div className="mt-5 mb-2 text-2xl">INGREDIENTS</div>
      {recipe.ingredients.map((item) => (
        <div key={item.index}>
          <div className="text-1xl font-bold capitalize">{item.groupName}</div>
          {item.ingredients.map((ingredient) => (
            <div className="mb-2" key={ingredient.index}>
              {ingredient.quantity && <span className="mr-2 font-bold">{ingredient.quantity}</span>}
              <span>{ingredient.string}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

RecipeIngredients.propTypes = {
  recipe: PropTypes.shape({
    ingredients: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};
