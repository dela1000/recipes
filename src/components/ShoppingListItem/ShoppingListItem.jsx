import { useState, useEffect } from 'react';
import { Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function ShoppingListItem({ ingredient }) {
  const [checked, setChecked] = useState(false);
  const [ingredientString, setIngredientString] = useState(false);

  const handleCheckBoxClick = () => {
    setChecked(!checked);
  };

  const concatString = () => {
    let string = '';
    if (ingredient.quantity) string += `${ingredient.quantity} `;
    string += ingredient.string;
    setIngredientString(string);
  };

  useEffect(() => {
    concatString();
  }, []);

  return (
    <div key={ingredient.string}>
      <div className="flex">
        <Checkbox
          color="primary"
          type="checkbox"
          className="mr-2"
          checked={checked}
          onChange={handleCheckBoxClick}
        />
        <div className="mt-2">
          <span className={`${checked ? 'line-through text-gray-400' : ''}`}>
            {ingredientString}
          </span>
        </div>
      </div>
    </div>
  );
}

ShoppingListItem.propTypes = {
  ingredient: PropTypes.shape({ quantity: PropTypes.string, string: PropTypes.string }).isRequired,
};
