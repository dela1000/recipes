import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';

export async function getDataByIdInternal(data) {
  const docSnap = await getDoc(data.docRef);

  const recipe = docSnap.data();
  recipe.id = data.recipeId;

  return docSnap.exists() ? recipe : false;
}

export async function updateRecipe(data) {
  const docRef = doc(data.db, `users/${data.currentUserId}/recipes/${data.recipeId}`);

  await updateDoc(docRef, data.payload);

  return getDataByIdInternal({ docRef, recipeId: data.recipeId });
}

export async function getAllRecipes(data) {
  const recipes = await getDocs(
    query(
      collection(data.db, `users/${data.currentUserId}/recipes/`),
      where('deleted', '==', false),
    ),
  );
  const itemsWithIds = [];
  recipes.forEach((recipe) => {
    const item = recipe.data();
    item.id = recipe.id;
    itemsWithIds.push(item);
  });
  return itemsWithIds;
}

export async function addRecipe(data) {
  const newRecipe = await addDoc(
    collection(data.db, `users/${data.currentUserId}/recipes`),
    data.payload,
  );

  const docRef = doc(data.db, `users/${data.currentUserId}/recipes/${newRecipe.id}`);

  return getDataByIdInternal({ docRef, recipeId: newRecipe.id });
}

export async function getRecipesByQuery(data) {
  const recipesOnShoppingList = [];
  const querySnapshot = await getDocs(
    query(
      collection(data.db, `users/${data.currentUserId}/recipes/`),
      where(data.payload.key, data.payload.where, data.payload.value),
    ),
  );
  querySnapshot.forEach((d) => {
    const recipe = d.data();
    recipe.id = d.id;
    recipesOnShoppingList.push(recipe);
  });
  return recipesOnShoppingList;
}

export async function getRecipeById(data) {
  const docRef = doc(data.db, `users/${data.currentUserId}/recipes/${data.payload.id}`);
  const docSnap = await getDoc(docRef);

  const recipe = docSnap.data();
  recipe.id = data.payload.id;

  return docSnap.exists() ? recipe : false;
}

export async function getAllShoppingListItems(data) {
  const shoppingListItems = await getDocs(
    collection(data.db, `users/${data.currentUserId}/shoppingList/`),
  );
  const itemsWithIds = [];
  shoppingListItems.forEach((recipe) => {
    const item = recipe.data();
    item.id = recipe.id;
    itemsWithIds.push(item);
  });
  return itemsWithIds[0];
}

export async function addShoppingListInitialItems(data) {
  const newShoppingList = await addDoc(
    collection(data.db, `users/${data.currentUserId}/shoppingList`),
    data.payload,
  );

  const docRef = doc(data.db, `users/${data.currentUserId}/shoppingList/${newShoppingList.id}`);

  return getDataByIdInternal({ docRef, recipeId: newShoppingList.id });
}

export async function updateShoppingList(data) {
  const docRef = doc(
    data.db,
    `users/${data.currentUserId}/shoppingList/${data.extraShoppingItemsId}`,
  );

  await updateDoc(docRef, data.payload);

  return getDataByIdInternal({ docRef, recipeId: data.extraShoppingItemsId });
}
