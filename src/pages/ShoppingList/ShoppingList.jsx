import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  dbState,
  currentUserState,
  loadingOverlayState,
  onShoppingListState,
  allShoppingItemsState,
} from '../../contexts/atoms/atoms';
import ShoppingListHolder from '../../components/ShoppingListHolder';
import AddToShoppingListInput from '../../components/AddToShoppingListInput';

import { getRecipesByQuery, getAllShoppingListItems } from '../../adapters/recipeAdapters';

export default function ShoppingList() {
  const [recipesOnShoppingList, setRecipesOnShoppingList] = useRecoilState(onShoppingListState);
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingOverlayState);
  const [extraShoppingItems, setExtraShoppingItems] = useRecoilState(allShoppingItemsState);

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

  const getShoppingListItems = async () => {
    const data = await getAllShoppingListItems({
      db,
      currentUserId: currentUser.uid,
    });
    console.log('+++ 44: src/pages/ShoppingList/ShoppingList.jsx - data: ', data);
    if (data) {
      setExtraShoppingItems(data);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getShoppingListRecipes(true);
      getShoppingListItems();
    }
  }, [currentUser]);

  return (
    <div className="fade-in">
      <AddToShoppingListInput />
      {extraShoppingItems?.manualShoppingListItems?.manualShoppingListItems?.length > 0 ||
      recipesOnShoppingList.length > 0 ? (
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
