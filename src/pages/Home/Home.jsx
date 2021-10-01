import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import {
  // dbState,
  currentUserState,
  loadingOverlayState,
  allRecipesState,
} from '../../contexts/atoms/atoms';

// import {
//   // getAllRecipes,
//   getRecipeById,
// } from '../../adapters/recipeAdapters';

import AddRecipeButton from '../../components/AddRecipeButton';
import RecipesListHolder from '../../components/RecipesListHolder';

import recipesDataFile from '../../adapters/recipesDataSmall';

export default function Home() {
  // const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingOverlayState);
  const [recipeData, setRecipeData] = useRecoilState(allRecipesState);

  // const getRecipes = async (showLoading) => {
  //   if (showLoading) setLoading(true);
  //   const addIds = [];
  //   const recipesFromDb = await getAllRecipes({ db, currentUserId: currentUser.uid });
  //   recipesFromDb.forEach((doc) => {
  //     const item = doc.data();
  //     item.id = doc.id;
  //     addIds.push(item);
  //   });
  //   setRecipesData(addIds);
  //   setLoading(false);
  // };

  const getRecipesTest = (showLoading) => {
    if (showLoading) setLoading(true);
    const addIds = [];
    recipesDataFile.forEach((recipe, idx) => {
      const parsedRecipe = JSON.parse(JSON.stringify(recipe));
      parsedRecipe.id = idx.toString();
      addIds.push(parsedRecipe);
    });
    setRecipeData(addIds);
    setLoading(false);
  };

  // const updateSingleRecipe = async (recipeId) => {
  //   const recipeById = await getRecipeById({
  //     db,
  //     currentUserId: currentUser.uid,
  //     payload: { id: recipeId },
  //   });
  //   const clonedRecipesData = [...recipeData];
  //   const objIndex = clonedRecipesData.findIndex((obj) => obj.id === recipeId);
  //   clonedRecipesData[objIndex] = recipeById;
  //   console.log('+++ 47: src/pages/Home/Home.jsx - clonedRecipesData: ', clonedRecipesData);
  //   // setRecipesData([...clonedRecipesData]);
  // };

  useEffect(() => {
    if (currentUser.uid) {
      getRecipesTest();
    }
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="fade-in">
      {recipeData.length > 0 ? (
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
