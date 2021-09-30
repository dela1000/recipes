import { useSetRecoilState } from 'recoil';

import RouterHolder from './RouterHolder';

import { currentUserState } from './contexts/atoms/atoms';
import { IsLoggedIn, signInWithGoogle } from './contexts/auth/authFunctions';

export default function App() {
  const setCurrentUser = useSetRecoilState(currentUserState);

  const [user, loading, error] = IsLoggedIn();
  const storeCurrentUser = (userData) => {
    if (userData) {
      return setCurrentUser(JSON.parse(JSON.stringify(userData)));
    }
    return setCurrentUser([]);
  };

  const handleSignInWithGoogle = async () => {
    const userFound = await signInWithGoogle();
    if (userFound) {
      storeCurrentUser(userFound);
    }
  };

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
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
  return (
    <button type="button" onClick={handleSignInWithGoogle}>
      Log in
    </button>
  );
}
