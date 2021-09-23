import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Context } from '../../contexts/context';

import RecipesListHolder from '../../components/RecipesListHolder';

// import recipesData from '../../adapters/recipesData';

export default function Home() {
  const [{ db, currentUser }] = useContext(Context);
  const [recipesData, setRecipesData] = useState([]);

  useEffect(async () => {
    const allRecipes = [];
    if (currentUser) {
      const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/recipes`));
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        item.id = doc.id;
        allRecipes.push(item);
      });
      if (allRecipes.length >= 0) setRecipesData([...allRecipes]);
    }
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addThing = async () => {
    const docRef = await addDoc(collection(db, `users/${currentUser.uid}/recipes`), {
      title: 'Wine & Tomato Braised Chicken',
      favorite: false,
      description: 'Makes: 10 servings',
      activeTime: '45 minutes',
      totalTime: '3 3/4-6 3/4 hours',
      source: '',
      originalURL: 'http://www.eatingwell.com/recipes/wine_tomato_braised_chicken.html',
      yield: '10',
      active: '45 minutes',
      total: '3 3/4-6 3/4 hours',
      categories: [],
      image:
        'https://static01.nyt.com/images/2020/02/10/dining/ch-tomato-and-coconut-braised-chicken/merlin_166828545_50e59496-f715-4d3a-a58e-4d03df861168-articleLarge.jpg',
      ingredients: {
        standard: [
          '4 slices bacon',
          '1 large onion, thinly sliced',
          '4 cloves garlic, minced',
          '1 teaspoon dried thyme',
          '1 teaspoon fennel seeds',
          '1 teaspoon freshly ground pepper',
          '1 bay leaf',
          '1 cup dry white wine (see Tip)',
          '1 28-ounce can whole tomatoes, with juice, coarsely chopped',
          '1 teaspoon salt',
          '10 bone-in chicken thighs (about 3 3/4 pounds), skin removed, trimmed',
          '1/4 cup finely chopped fresh parsley',
        ],
      },
      instructions: {
        standard: [
          'Cook bacon in a large skillet over medium heat until crisp, about 4 minutes. Transfer to paper towels to drain. Crumble when cool.',
          'Drain off all but 2 tablespoons fat from the pan. Add onion and cook over medium heat, stirring, until softened, 3 to 6 minutes. Add garlic, thyme, fennel seeds, pepper and bay leaf and cook, stirring, for 1 minute. Add wine, bring to a boil and boil for 2 minutes, scraping up any browned bits. Add tomatoes and their juice and salt; stir well.',
          'Place chicken thighs in a 4-quart (or larger) slow cooker. Sprinkle the bacon over the chicken. Pour the tomato mixture over the chicken. Cover and cook until the chicken is very tender, about 3 hours on High or 6 hours on Low. Remove the bay leaf. Serve sprinkled with parsley.',
          'Variation: Turn 2 cups each of leftover chicken and sauce into Braised Chicken Gumbo. Heat 1 tablespoon extra-virgin olive oil in a large saucepan over medium heat. Add 1 diced medium red or green bell pepper and 2 tablespoons all-purpose flour and cook, stirring, until the pepper is beginning to soften and the flour is golden brown, about 2 minutes. Add 2 cups shredded chicken, 2 cups sauce, 2 cups reduced-sodium chicken broth, 1 cup sliced okra (fresh or frozen, thawed), 3/4 cup instant brown rice (see Tip) and 1/8-1/4 teaspoon cayenne pepper. Bring to a boil. Reduce the heat and simmer until the flavors meld and the okra is tender, about 10 minutes.',
        ],
      },
      notes: {
        makeAheadTip:
          'Prepare Steps 1 & 2, cover and refrigerate bacon and sauce separately for up to 1 day. To finish, bring the sauce to a simmer and continue with Step 3. The cooked chicken and sauce can be refrigerated for up to 3 days. | equipment: 4-quart or larger slow cooker',
        tips: [
          'If you want to use rice that is not “instant,” stir in 1 cup of any leftover cooked rice instead. Or, if you have time, add 1/2 cup of quicker-cooking whole-grain rice, such as Bhutanese red rice or Kalijira rice, and an additional 11/4 cups of chicken broth before adding the okra. Cook until the rice is almost tender, about 25 minutes (or according to package instructions) then add the okra and simmer until it is tender.',
          'If you prefer, substitute 1 cup reduced-sodium chicken broth mixed with 1 tablespoon fresh lemon juice for the wine.',
        ],
        nutrition: {
          perServing:
            '260 calories; 13 g fat (4 g sat, 5 g mono); 88 mg cholesterol; 6 g carbohydrates; 0 g added sugars; 25 g protein; 1 g fiber; 492 mg sodium; 392 mg potassium.',
        },
      },
    });
    console.log('Document written with ID: ', docRef.id);
  };

  return (
    <div className="fade-in">
      <button type="button" onClick={addThing}>
        button
      </button>
      <RecipesListHolder recipesData={recipesData} />
    </div>
  );
}
