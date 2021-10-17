import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';

import PropTypes from 'prop-types';
import foodsCollection from '../../helpers/foodsCollection';
import shopppingGroups from '../../helpers/shoppingGroups';

export default function ShoppingListByGroup({ recipesOnShoppingList }) {
  const [ingredientGroups, setIngredientGroups] = useState([]);
  const allIngredients = {};

  recipesOnShoppingList.forEach((recipe) => {
    recipe.ingredients.forEach((ingredientsGroup) => {
      ingredientsGroup.ingredients.forEach((ingredient) => {
        allIngredients[ingredient.string] = ingredient;
      });
    });
  });

  const sortIngredients = () => {
    const shopppingGroupsCopy = JSON.parse(JSON.stringify(shopppingGroups));
    Object.keys(foodsCollection).forEach((food) => {
      const groupId = foodsCollection[food].shoppingGroupId;
      Object.keys(allIngredients).forEach((ingredient) => {
        const ingredientString = allIngredients[ingredient].string.toLowerCase();
        const found = ingredient.match(food);
        if (found) {
          if (!shopppingGroupsCopy[groupId].ingredients[ingredientString]) {
            shopppingGroupsCopy[groupId].ingredients[ingredientString] = allIngredients[ingredient];
            delete shopppingGroupsCopy[0].ingredients[ingredientString];
            delete allIngredients[ingredient];
          }
        } else {
          shopppingGroupsCopy[0].ingredients[ingredientString] = allIngredients[ingredient];
        }
      });
    });

    const ingredientsArray = [];

    Object.keys(shopppingGroupsCopy).forEach((group) => {
      if (!isEmpty(shopppingGroupsCopy[group].ingredients)) {
        ingredientsArray.push(shopppingGroupsCopy[group]);
      }
    });

    const finalArray = orderBy(ingredientsArray, ['id'], ['asc']);
    finalArray.forEach((item) => {
      item.ingredients = Object.values(item.ingredients);
    });

    setIngredientGroups(finalArray);
  };

  useEffect(() => {
    sortIngredients();
  }, []);

  return (
    <div>
      {ingredientGroups.map((group) => (
        <div key={group.id}>
          <div className="capitalize font-bold">{group.name}</div>
          <div>
            {group.ingredients.map((ingredient) => (
              <div key={ingredient.string}>{ingredient.string}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

ShoppingListByGroup.propTypes = {
  recipesOnShoppingList: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
};
