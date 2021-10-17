import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  dbState,
  currentUserState,
  loadingOverlayState,
  onShoppingListState,
} from '../../contexts/atoms/atoms';
import ShoppingListHolder from '../../components/ShoppingListHolder';
import AddToShoppingListInput from '../../components/AddToShoppingListInput';

import { getRecipesByQuery } from '../../adapters/recipeAdapters';

export default function ShoppingList() {
  const [recipesOnShoppingList, setRecipesOnShoppingList] = useRecoilState(onShoppingListState);
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingOverlayState);

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
    setRecipesOnShoppingList([]);
    setRecipesOnShoppingList(JSON.parse(JSON.stringify(recipesFromDb)));
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      getShoppingListRecipes(true);
    }
  }, [currentUser]);

  return (
    <div className="fade-in">
      <div className="mb-5">
        <div className="text-5xl pt-1 mr-12 uppercase pt-9">Shopping List</div>
      </div>
      <AddToShoppingListInput />
      {recipesOnShoppingList.length > 0 ? (
        <ShoppingListHolder getShoppingListRecipes={getShoppingListRecipes} />
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
