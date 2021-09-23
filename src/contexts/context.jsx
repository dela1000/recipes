import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Context = createContext();

const Provider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [token, setToken] = useState();
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

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        setToken(credential.accessToken);
        // The signed-in user info.
        if (result.user) {
          await setDoc(doc(db, 'users', result.user.uid), {
            recipes: [],
          });
          setCurrentUser(result.user);
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const { code, message, email } = error;
        console.log('+++ 24: src/pages/Signin/Signin.jsx - code: ', code);
        console.log('+++ 25: src/pages/Signin/Signin.jsx - message: ', message);
        console.log('+++ 26: src/pages/Signin/Signin.jsx - email: ', email);
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('+++ 25: src/pages/Signin/Signin.jsx - credential: ', credential);
      });
  };

  const signOut = () => {
    auth.signOut();
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
          signInWithGoogle,
          signOut,
          currentUser,
          setCurrentUser,
          token,
          db,
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
