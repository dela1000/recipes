import { useContext, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Context } from '../../contexts/context';

import RecipesListHolder from '../../components/RecipesListHolder';

import recipesData from '../../adapters/recipesData';

export default function Home() {
  const [{ db, currentUser }] = useContext(Context);

  useEffect(async () => {
    if (currentUser) {
      const querySnapshot = await getDocs(collection(db, 'users', currentUser.uid));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fade-in">
      <RecipesListHolder recipesData={recipesData} />
    </div>
  );
}
