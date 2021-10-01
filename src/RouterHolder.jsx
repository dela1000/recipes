// React
import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
// Internal
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import LoadingOverlay from './components/LoadingOverlay';
import Home from './pages/Home';
import Recipe from './pages/Recipe';
// import AddRecipe from './pages/AddRecipe';
// import ShoppingList from './pages/ShoppingList';
// import EditRecipe from './pages/EditRecipe';
// Contexts
import { navbarState } from './contexts/atoms/atoms';
import useWindowDimensions from './contexts/useWindowDimensions';
// Styles
import './tailwind.css';
import './App.css';

export default function RouterHolder() {
  const navbar = useRecoilValue(navbarState);
  const { width } = useWindowDimensions();
  const [windowType, setWindowType] = useState('desktop');

  useEffect(() => {
    if (width < 768) {
      setWindowType('mobile');
    } else {
      setWindowType('desktop');
    }
  }, [width]);

  return (
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
              {/* <Route exact path="/addrecipe">
                <AddRecipe windowType={windowType} />
              </Route>
              <Route exact path="/editrecipe">
                <EditRecipe windowType={windowType} />
              </Route>
              <Route exact path="/shoppinglist">
                <ShoppingList windowType={windowType} />
              </Route> */}
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </Router>
  );
}
