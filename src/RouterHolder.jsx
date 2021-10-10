// React
import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
// Contexts
import {
  navbarState,
  themeNameState,
  dbState,
  currentUserState,
  loadingOverlayState,
  allRecipesState,
  recipeState,
  recipeIdState,
  numberOfItemsOnShoppingListState,
} from './contexts/atoms/atoms';
import addItemsToShoppingListTotal from './contexts/addItemsToShoppingListTotal';
// Adapters
import { getAllRecipes } from './adapters/recipeAdapters';
// Internal
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import LoadingOverlay from './components/LoadingOverlay';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import ShoppingList from './pages/ShoppingList';
import useWindowDimensions from './contexts/useWindowDimensions';
// Styles
import './tailwind.css';
import './App.css';

export default function RouterHolder() {
  const navbar = useRecoilValue(navbarState);
  const themeName = useRecoilValue(themeNameState);
  const { width } = useWindowDimensions();
  const [windowType, setWindowType] = useState('desktop');

  const db = useRecoilValue(dbState);
  const currentUser = useRecoilValue(currentUserState);
  const setLoading = useSetRecoilState(loadingOverlayState);
  const [recipesData, setRecipesData] = useRecoilState(allRecipesState);
  const setNumberOfItemsOnShoppingList = useSetRecoilState(numberOfItemsOnShoppingListState);
  const resetRecipeState = useResetRecoilState(recipeState);
  const resetRecipeIdState = useResetRecoilState(recipeIdState);

  const determineOnShoppingList = (recipesToSee) => {
    const itemsOnShoppingList = addItemsToShoppingListTotal(recipesToSee);
    setNumberOfItemsOnShoppingList(itemsOnShoppingList);
  };

  const getRecipes = async (showLoading) => {
    if (showLoading) setLoading(true);
    const recipesFromDb = await getAllRecipes({ db, currentUserId: currentUser.uid });
    setRecipesData(recipesFromDb);
    determineOnShoppingList(recipesFromDb);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser.uid && recipesData.length === 0) {
      getRecipes(true);
    }
  }, [currentUser]);

  useEffect(() => {
    resetRecipeState();
    resetRecipeIdState();
  }, []);

  useEffect(() => {
    if (width < 768) {
      setWindowType('mobile');
    } else {
      setWindowType('desktop');
    }
  }, [width]);

  return (
    <div id="top" className={`${themeName} app`}>
      <Router>
        <LoadingOverlay />
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex-1 overflow-y-auto py-5 px-3 lg:px-5">
            <div style={{ display: navbar ? 'none' : 'block container' }} />
            <div className="relative mb-10 md:mx-40">
              <Switch>
                <Route exact path="/">
                  <Home windowType={windowType} />
                </Route>
                <Route exact path="/recipe">
                  <Recipe windowType={windowType} />
                </Route>
                <Route exact path="/addrecipe">
                  <AddRecipe windowType={windowType} />
                </Route>
                <Route exact path="/editrecipe">
                  <EditRecipe windowType={windowType} />
                </Route>
                <Route exact path="/shoppinglist">
                  <ShoppingList windowType={windowType} />
                </Route>
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Switch>
              <ScrollToTop />
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}
