import { useSetRecoilState } from 'recoil';
import './SignIn.css';
import { currentUserState } from '../../contexts/atoms/atoms';
import { signInWithGoogle } from '../../contexts/auth/authFunctions';

export default function SignIn() {
  const setCurrentUser = useSetRecoilState(currentUserState);

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

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <button className="login-with-google-btn" type="button" onClick={handleSignInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
