import { collection, doc, addDoc, getDocs, getDoc, updateDoc } from 'firebase/firestore';

export async function getRecipeById(data) {
  const docSnap = await getDoc(data.docRef);

  const recipe = docSnap.data();
  recipe.id = data.recipeId;

  return docSnap.exists() ? recipe : false;
}

export async function updateRecipe(data) {
  const docRef = doc(data.db, `users/${data.currentUserId}/recipes/${data.recipeId}`);

  await updateDoc(docRef, data.payload);

  return getRecipeById({ docRef, recipeId: data.recipeId });
}

export async function getAllRecipes(data) {
  const recipes = await getDocs(collection(data.db, `users/${data.currentUserId}/recipes`));
  return recipes;
}

export async function addRecipe(data) {
  const newRecipe = await addDoc(
    collection(data.db, `users/${data.currentUserId}/recipes`),
    data.payload,
  );

  const docRef = doc(data.db, `users/${data.currentUserId}/recipes/${newRecipe.id}`);

  return getRecipeById({ docRef, recipeId: newRecipe.id });
}
