import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import {
  dbState,
  currentUserState,
  loadingOverlayState,
  allRecipesState,
  recipeState,
  recipeIdState,
  numberOfItemsOnShoppingListState,
} from '../../contexts/atoms/atoms';
import addItemsToShoppingListTotal from '../../contexts/addItemsToShoppingListTotal';

import { getAllRecipes } from '../../adapters/recipeAdapters';

import AddRecipeButton from '../../components/AddRecipeButton';
import RecipesListHolder from '../../components/RecipesListHolder';

export default function Home() {
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingOverlayState);
  const [recipesData, setRecipesData] = useRecoilState(allRecipesState);
  const setNumberOfItemsOnShoppingList = useSetRecoilState(numberOfItemsOnShoppingListState);
  const resetRecipeState = useResetRecoilState(recipeState);
  const resetRecipeIdState = useResetRecoilState(recipeIdState);

  const determineOnShoppingList = (recipesToSee) => {
    const itemsOnShoppingList = addItemsToShoppingListTotal(recipesToSee);
    setNumberOfItemsOnShoppingList(itemsOnShoppingList);
  };

  const getRecipes = async (showLoading) => {
    console.log('+++ 27: src/pages/Home/Home.jsx - MAKING getRecipes CALL');
    if (showLoading) setLoading(true);
    const addIds = [];
    const recipesFromDb = await getAllRecipes({ db, currentUserId: currentUser.uid });
    recipesFromDb.forEach((doc) => {
      const item = doc.data();
      item.id = doc.id;
      addIds.push(item);
    });
    setRecipesData(addIds);
    determineOnShoppingList(addIds);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser.uid && recipesData.length === 0) {
      getRecipes(true);
    }
  }, [currentUser]);

  useEffect(() => {
    resetRecipeState();
    resetRecipeIdState();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="fade-in">
      {recipesData.length > 0 ? (
        <RecipesListHolder />
      ) : (
        <div className="flex h-screen">
          <div className="m-auto">
            <AddRecipeButton text="add your first recipe" />
          </div>
        </div>
      )}
    </div>
  );
}
