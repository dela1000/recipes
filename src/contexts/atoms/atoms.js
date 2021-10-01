import { atom } from 'recoil';
import { db } from '../../firebase';

export const currentUserState = atom({
  key: 'currentUser',
  default: [],
});

export const dbState = atom({
  key: 'db',
  default: db,
});

export const navbarState = atom({
  key: 'navbar',
  default: false,
});

export const loadingOverlayState = atom({
  key: 'loadingOverlayState',
  default: false,
});

export const themeNameState = atom({
  key: 'themeNameState',
  default: 'light',
});

export const allRecipesState = atom({
  key: 'allRecipes',
  default: [],
});

export const recipeIdState = atom({
  key: 'recipeIdState',
  default: null,
});

export const recipeState = atom({
  key: 'recipeState',
  default: {},
});

export const numberOfItemsOnShoppingListState = atom({
  key: 'numberOfItemsOnShoppingListState',
  default: 0,
});

export const allCategoriesState = atom({
  key: 'allCategoriesState',
  default: [],
});