import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header/index';
import ScrollToTop from './components/ScrollToTop/index';
import Home from './pages/Home/index';
import Recipe from './pages/Recipe/index';
import { Context } from './contexts/context';
import useWindowDimensions from './contexts/useWindowDimensions';
import './tailwind.css';
import './App.css';

export default function App() {
  const [{ themeName, navbarState }] = useContext(Context);
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
    <div id="top" className={`${themeName} app`}>
      <Router>
        <Header />
        <main style={{ display: navbarState ? 'none' : 'block' }}>
          <div className="container m-4 my-10 md:mx-40 h-screen">
            <Switch>
              <Route exact path="/">
                <Home windowType={windowType} />
              </Route>
              <Route exact path="/recipe">
                <Recipe windowType={windowType} />
              </Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
            <ScrollToTop />
          </div>
        </main>
      </Router>
    </div>
  );
}
