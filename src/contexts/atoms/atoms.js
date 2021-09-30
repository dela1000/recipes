import { atom } from 'recoil';
import { db } from '../../firebase';

export const currentUserState = atom({
  key: 'currentUser',
  default: [],
});

export const navbarState = atom({
  key: 'navbar',
  default: false,
});

export const dbState = atom({
  key: 'db',
  default: db,
});

export const allRecipesState = atom({
  key: 'allRecipes',
  default: [],
});

export const loadingOverlayState = atom({
  key: 'loadingOverlayState',
  default: false,
});
