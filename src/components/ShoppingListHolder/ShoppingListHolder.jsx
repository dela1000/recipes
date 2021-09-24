import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function ShoppingListHolder({ recipesOnShoppingList }) {
  const [recipesNames, setRecipesNames] = useState([]);

  useEffect(() => {
    const recipesNamesTemp = [];
    recipesOnShoppingList.forEach((recipe) => {
      recipesNamesTemp.push(recipe.title);
    });
    setRecipesNames([...recipesNamesTemp]);
  }, []);

  return (
    <div>
      <div className="mx-3 mb-5">
        <div className="text-5xl pt-1 mr-12 uppercase pt-9">Shopping List</div>
      </div>
      <div className="lg:flex flex-row mx-4">
        <div className="lg:w-3/12 pr-20">
          {recipesNames.length > 0 && (
            <div className="flex-grow  bg-orange-200">
              {recipesNames.map((rec) => (
                <div key={rec}>{rec}</div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:w-9/12">stuff goes here</div>
      </div>
    </div>
  );
}

ShoppingListHolder.propTypes = {
  recipesOnShoppingList: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
    }),
  ).isRequired,
};
