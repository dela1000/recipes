import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Navbar from '../Navbar/Navbar';
import './Header.css';

import { Context } from '../../contexts/context';

export default function Header() {
  const history = useHistory();
  const [{ themeName, recipeId, setRecipeId }] = useContext(Context);

  const goBackHome = () => {
    setRecipeId(null);
    history.push(`/`);
  };

  return (
    <header
      id="header"
      className={`${themeName}-header py-7 px-5 flex justify-around sticky top-0 z-50`}
    >
      <div>
        {recipeId && (
          <button type="button" className="flex" onClick={() => goBackHome()}>
            <div>
              <KeyboardArrowLeftIcon className="cursor-pointer" fontSize="large" />
            </div>
            <div className="mt-1.5">GO BACK</div>
          </button>
        )}
      </div>
      <Navbar />
    </header>
  );
}
