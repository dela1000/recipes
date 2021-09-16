import { useEffect } from 'react';
import RecipesListHolder from '../../components/RecipesListHolder';

import recipesData from '../../adapters/recipesData';

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fade-in">
      <RecipesListHolder recipesData={recipesData} />
    </div>
  );
}
