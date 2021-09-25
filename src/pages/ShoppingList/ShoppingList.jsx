import { useContext, useEffect, useState } from 'react';
import ShoppingListHolder from '../../components/ShoppingListHolder';

import { getRecipesByQuery } from '../../adapters/recipeAdapters';

import { Context } from '../../contexts/context';

export default function ShoppingList() {
  const [{ db, currentUser, setLoading }] = useContext(Context);
  const [recipesOnShoppingList, setRecipesOnShoppingList] = useState([]);

  const getShoppingListRecipes = async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }
    const recipesFromDb = await getRecipesByQuery({
      db,
      currentUserId: currentUser.uid,
      payload: {
        key: 'onShoppingList',
        where: '==',
        value: true,
      },
    });
    setLoading(false);
    setRecipesOnShoppingList(recipesFromDb);
  };

  useEffect(() => {
    if (currentUser) {
      getShoppingListRecipes(true);
    }
  }, [currentUser]);
  return (
    <div className="fade-in">
      {recipesOnShoppingList.length > 0 ? (
        <ShoppingListHolder
          recipesOnShoppingList={recipesOnShoppingList}
          getShoppingListRecipes={getShoppingListRecipes}
        />
      ) : (
        <div className="mx-3 mb-5">
          <div className="text-3xl pt-1 mr-12 uppercase pt-9">
            There are no items on the Shopping List
          </div>
        </div>
      )}
    </div>
  );
}
