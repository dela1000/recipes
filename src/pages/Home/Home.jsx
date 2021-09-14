import { useEffect } from 'react';
import RecipesList from '../../components/RecipesList/index';

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fade-in">
      <RecipesList />
    </div>
  );
}
