import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useHistory } from 'react-router-dom';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import BrightnessLowIcon from '@material-ui/icons/BrightnessLow';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import {
  themeNameState,
  navbarState,
  numberOfItemsOnShoppingListState,
} from '../../contexts/atoms/atoms';
import { signOut } from '../../contexts/auth/authFunctions';
import useWindowDimensions from '../../contexts/useWindowDimensions';
import './Navbar.css';

const navList = [
  { name: 'recipes', navigate: '' },
  { name: 'add recipe', navigate: 'addrecipe' },
  { name: 'shopping list', navigate: 'shoppinglist' },
];

export default function Navbar() {
  const { width } = useWindowDimensions();
  const [currentWidth, setCurrentWidth] = useState(0);
  const [shoppingListNumber, setShoppingListNumber] = useState(0);
  const history = useHistory();

  const [themeName, setThemeName] = useRecoilState(themeNameState);
  const [navbar, setNavbar] = useRecoilState(navbarState);
  const numberOfItemsOnShoppingList = useRecoilValue(numberOfItemsOnShoppingListState);

  const toggleTheme = () => {
    const name = themeName === 'dark' ? 'light' : 'dark';
    localStorage.setItem('themeName', name);
    setThemeName(name);
  };

  useEffect(() => {
    if (currentWidth !== width) {
      setNavbar(false);
      setCurrentWidth(width);
    }
  }, [width]);

  const toggleNavList = () => setNavbar(!navbarState);
  const closeNavList = () => setNavbar(false);

  const navigate = (navigateTo) => {
    closeNavList();
    history.push(`/${navigateTo}`);
  };

  useEffect(() => {
    setShoppingListNumber(numberOfItemsOnShoppingList);
  }, [numberOfItemsOnShoppingList]);

  return (
    <nav className="center">
      <div
        style={{ display: navbar ? 'flex' : null }}
        className={
          navbar
            ? `${themeName}_nav__list__background_color nav__list h-screen`
            : `${themeName}_nav__list__background_color nav__list`
        }
      >
        {navList.map((navOption) => (
          <div key={navOption.name} className="nav-list-item monserrat link link-nav">
            <button
              className="uppercase fade-in"
              type="button"
              onClick={() => {
                navigate(navOption.navigate);
              }}
            >
              {navOption.name}
            </button>
            {shoppingListNumber > 0 && navOption.navigate === 'shoppinglist' && (
              <span className="ml-1">({shoppingListNumber})</span>
            )}
          </div>
        ))}
        <div className="nav-list-item monserrat link link-nav">
          <button
            className="uppercase fade-in"
            type="button"
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="center btn btn-icon"
        aria-label="toggle theme"
      >
        {themeName === 'dark' ? <BrightnessLowIcon /> : <BrightnessHighIcon />}
      </button>

      <button
        type="button"
        onClick={toggleNavList}
        className="btn btn-icon nav__hamburger"
        aria-label="toggle navigation"
      >
        {navbar ? <CloseIcon /> : <MenuIcon />}
      </button>
    </nav>
  );
}
