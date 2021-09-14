import { useEffect } from 'react';
import Recipe from '../../components/Recipe/index';

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fade-in">
      <Recipe />
    </div>
  );
}
