import { useSetRecoilState } from 'recoil';

import RouterHolder from './RouterHolder';
import SignIn from './pages/SignIn';

import { currentUserState, loadingOverlayState } from './contexts/atoms/atoms';
import { IsLoggedIn } from './contexts/auth/authFunctions';

export default function App() {
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setLoading = useSetRecoilState(loadingOverlayState);

  const [user, loading, error] = IsLoggedIn();
  const storeCurrentUser = (userData) => {
    if (userData) {
      return setCurrentUser(JSON.parse(JSON.stringify(userData)));
    }
    return setCurrentUser([]);
  };

  if (loading) {
    setLoading(true);
  }
  setLoading(false);
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    storeCurrentUser(user);
    return <RouterHolder />;
  }
  // If signOut is called, or user is not found
  storeCurrentUser();
  return <SignIn />;
}
