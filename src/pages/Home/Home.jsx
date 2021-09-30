import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dbState, currentUserState, loadingOverlayState } from '../../contexts/atoms/atoms';

import { getAllRecipes, getRecipeById } from '../../adapters/recipeAdapters';

import AddRecipeButton from '../../components/AddRecipeButton';
import RecipesListHolder from '../../components/RecipesListHolder';

export default function Home() {
  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingOverlayState);

  const [recipesData, setRecipesData] = useState([]);

  const getRecipes = async (showLoading) => {
    if (showLoading) setLoading(true);
    const allRecipes = [];
    const recipesFromDb = await getAllRecipes({ db, currentUserId: currentUser.uid });

    recipesFromDb.forEach((doc) => {
      const item = doc.data();
      item.id = doc.id;
      allRecipes.push(item);
    });
    setRecipesData([]);
    setRecipesData([...allRecipes]);
    setLoading(false);
  };

  const updateSingleRecipe = async (recipeId) => {
    const recipeById = await getRecipeById({
      db,
      currentUserId: currentUser.uid,
      payload: { id: recipeId },
    });
    const clonedRecipesData = [...recipesData];
    const objIndex = clonedRecipesData.findIndex((obj) => obj.id === recipeId);
    clonedRecipesData[objIndex] = recipeById;
    setRecipesData([...clonedRecipesData]);
  };

  useEffect(() => {
    if (currentUser) {
      getRecipes();
    }
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fade-in">
      {recipesData.length > 0 ? (
        <RecipesListHolder recipesData={recipesData} updateSingleRecipe={updateSingleRecipe} />
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
