import PropTypes from 'prop-types';
import ShoppingListIngredientItems from '../ShoppingListIngredientItems';

export default function ShoppingListByRecipe({ recipeData }) {
  return (
    <div>
      <div className="text-xl mb-2 capitalize italic">{recipeData.title}</div>
      <ShoppingListIngredientItems ingredients={recipeData.ingredients} />
    </div>
  );
}
ShoppingListByRecipe.propTypes = {
  recipeData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    ingredients: PropTypes.shape({}).isRequired,
  }).isRequired,
};
