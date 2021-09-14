import { useEffect } from 'react';
import RecipeInfo from '../../components/RecipeInfo/index';

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fade-in">
      <RecipeInfo />
    </div>
  );
}
