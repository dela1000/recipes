import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import BrightnessLowIcon from '@material-ui/icons/BrightnessLow';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { Context } from '../../contexts/context';
import useWindowDimensions from '../../contexts/useWindowDimensions';
import './Navbar.css';

const navList = ['recipes'];

export default function Navbar() {
  const { width } = useWindowDimensions();
  const [currentWidth, setCurrentWidth] = useState(0);
  const history = useHistory();
  const [{ themeName, toggleTheme, navbarState, toggleNavbar }] = useContext(Context);

  useEffect(() => {
    if (currentWidth !== width) {
      toggleNavbar(false);
      setCurrentWidth(width);
    }
  }, [width]);

  const toggleNavList = () => toggleNavbar(!navbarState);
  const closeNavList = () => toggleNavbar(false);

  const navigate = (navigateTo) => {
    history.push(`/${navigateTo}`);
  };

  return (
    <nav className="center">
      <div
        style={{ display: navbarState ? 'flex' : null }}
        className={
          navbarState
            ? `${themeName}_nav__list__background_color nav__list h-screen`
            : `${themeName}_nav__list__background_color nav__list`
        }
      >
        {navList.map((navOption) => (
          <div key={navOption} className="nav-list-item monserrat link link-nav">
            <button
              className="uppercase"
              type="button"
              onClick={() => {
                closeNavList();
                navigate(navOption);
              }}
            >
              {navOption}
            </button>
          </div>
        ))}
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
        {navbarState ? <CloseIcon /> : <MenuIcon />}
      </button>
    </nav>
  );
}
