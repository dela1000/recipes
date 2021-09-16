import { useEffect } from 'react';
import RecipesListHolder from '../../components/RecipesListHolder';

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fade-in">
      <RecipesListHolder />
    </div>
  );
}
