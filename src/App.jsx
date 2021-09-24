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
          <Header />
          <div style={{ display: navbarState ? 'none' : 'block container' }} />
          <div className="mt-10 md:mx-40 h-screen">
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
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
            <ScrollToTop />
          </div>
        </Router>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
