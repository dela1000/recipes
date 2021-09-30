import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useHistory, useLocation } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import { themeNameState, recipeIdState } from '../../contexts/atoms/atoms';
import Navbar from '../Navbar/Navbar';
import './Header.css';

export default function Header() {
  const history = useHistory();
  const themeName = useRecoilValue(themeNameState);
  const setRecipeId = useSetRecoilState(recipeIdState);
  const location = useLocation();

  const goBackHome = () => {
    setRecipeId(null);
    history.push(`/`);
  };

  return (
    <header id="header" className={`${themeName}-header py-6 lg:py-7 lg:px-5 flex justify-around`}>
      <div className="w-32">
        {location.pathname !== '/' && (
          <button type="button" className="flex" onClick={() => goBackHome()}>
            <KeyboardArrowLeftIcon className="cursor-pointer" fontSize="large" />
            <div className="mt-1.5">GO HOME</div>
          </button>
        )}
      </div>
      <Navbar />
    </header>
  );
}
