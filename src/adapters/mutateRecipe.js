import { collection, doc, getDocs, getDoc, updateDoc } from 'firebase/firestore';

export async function updateRecipe(data) {
  const docRef = doc(data.db, `users/${data.currentUserId}/recipes/${data.recipeId}`);
  await updateDoc(docRef, data.payload);
  const docSnap = await getDoc(docRef);

  const updatedRecipe = docSnap.data();
  updatedRecipe.id = data.recipeId;

  return docSnap.exists() ? updatedRecipe : false;
}

export async function getAllRecipes(data) {
  const recipes = await getDocs(collection(data.db, `users/${data.currentUserId}/recipes`));
  return recipes;
}
