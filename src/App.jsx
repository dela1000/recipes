// React
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
// Firebase
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebaseApp from './firebase';
// Internal
import SignIn from './pages/SignIn';
import Header from './components/Header/index';
import ScrollToTop from './components/ScrollToTop/index';
import Home from './pages/Home/index';
import Recipe from './pages/Recipe/index';
import AddRecipe from './pages/AddRecipe/index';
import ShoppingList from './pages/ShoppingList/index';
import EditRecipe from './pages/EditRecipe/index';
// Contexts
import { Context } from './contexts/context';
import useWindowDimensions from './contexts/useWindowDimensions';
// Styles
import './tailwind.css';
import './App.css';

export default function App() {
  const [{ themeName, navbarState, setCurrentUser }] = useContext(Context);
  const { width } = useWindowDimensions();
  const [windowType, setWindowType] = useState('desktop');

  const auth = getAuth(firebaseApp);
  const [user] = useAuthState(auth);
  if (user) {
    setCurrentUser(user);
  }

  useEffect(() => {
    if (width < 768) {
      setWindowType('mobile');
    } else {
      setWindowType('desktop');
    }
  }, [width]);

  return (
    <div id="top" className={`${themeName} app overflow-x-hidden`}>
      {user ? (
        <Router>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-1 overflow-y-auto py-5 px-3 lg:px-5">
              <div style={{ display: navbarState ? 'none' : 'block container' }} />
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
      ) : (
        <SignIn />
      )}
    </div>
  );
}
