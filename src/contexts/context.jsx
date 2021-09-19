import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Context = createContext();

const Provider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');
  const [navbarState, setNavbarState] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [recipe, setRecipe] = useState({});

  useEffect(() => {
    const isDark = localStorage.getItem('themeName') === 'light';
    if (isDark) setThemeName('light');
  }, []);

  const toggleTheme = () => {
    const name = themeName === 'dark' ? 'light' : 'dark';
    localStorage.setItem('themeName', name);
    setThemeName(name);
  };

  const toggleNavbar = (newState) => {
    setNavbarState(newState);
  };

  return (
    <Context.Provider
      value={[
        {
          themeName,
          toggleTheme,
          navbarState,
          toggleNavbar,
          recipeId,
          setRecipeId,
          recipe,
          setRecipe,
        },
      ]}
    >
      {children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Provider, Context };
