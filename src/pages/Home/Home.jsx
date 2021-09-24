import { useContext, useEffect, useState } from 'react';
import { Context } from '../../contexts/context';

import { getAllRecipes } from '../../adapters/recipeAdapters';

import AddRecipeButton from '../../components/AddRecipeButton';
import RecipesListHolder from '../../components/RecipesListHolder';

export default function Home() {
  const [{ db, currentUser }] = useContext(Context);
  const [recipesData, setRecipesData] = useState([]);

  const getRecipes = async () => {
    const allRecipes = [];
    const recipesFromDb = await getAllRecipes({ db, currentUserId: currentUser.uid });

    recipesFromDb.forEach((doc) => {
      const item = doc.data();
      item.id = doc.id;
      allRecipes.push(item);
    });
    setRecipesData([...allRecipes]);
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
        <RecipesListHolder recipesData={recipesData} />
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
