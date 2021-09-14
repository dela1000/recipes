import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header/index';
import Home from './pages/Home/index';

// import recipesData from './adapters/recipesData';

export default function App() {
  return (
    <Router>
      `<Header />
      <main>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}
