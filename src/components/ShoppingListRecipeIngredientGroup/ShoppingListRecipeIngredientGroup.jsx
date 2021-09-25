import PropTypes from 'prop-types';
import ShoppingListItem from '../ShoppingListItem';

export default function ShoppingListRecipeIngredientGroup({
  updateShoppingListRecipe,
  ingredientsGroup,
}) {
  return (
    <div>
      {ingredientsGroup.ingredients.map((ingredient) => (
        <ShoppingListItem
          key={ingredient.index}
          ingredient={ingredient}
          updateShoppingListRecipe={updateShoppingListRecipe}
        />
      ))}
    </div>
  );
}

ShoppingListRecipeIngredientGroup.propTypes = {
  ingredientsGroup: PropTypes.shape({
    ingredients: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  updateShoppingListRecipe: PropTypes.func.isRequired,
};
