import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import AddRecipeButton from '../../components/AddRecipeButton';
import RecipesListHolder from '../../components/RecipesListHolder';
import { allRecipesState } from '../../contexts/atoms/atoms';

export default function Home() {
  const recipesData = useRecoilValue(allRecipesState);

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
