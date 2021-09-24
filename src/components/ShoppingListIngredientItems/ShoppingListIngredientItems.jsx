import PropTypes from 'prop-types';

import ShoppingListItem from '../ShoppingListItem';

export default function ShoppingListIngredientItems({ ingredients }) {
  const ingredientsHeaders = Object.keys(ingredients);

  return (
    <div className="mb-5 pl-3 lg:pl-0">
      {ingredientsHeaders.map((header) => (
        <div key={header}>
          <div className="mb-3">
            {ingredients[header].map((ingredient) => (
              <ShoppingListItem key={ingredient.string} ingredient={ingredient} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

ShoppingListIngredientItems.propTypes = {
  ingredients: PropTypes.shape({
    standard: PropTypes.arrayOf(
      PropTypes.shape({ quantity: PropTypes.string, string: PropTypes.string }),
    ),
  }).isRequired,
};
