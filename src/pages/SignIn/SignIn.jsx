import { useContext } from 'react';
import './SignIn.css';
import { Context } from '../../contexts/context';

export default function SignIn() {
  const [{ signInWithGoogle }] = useContext(Context);

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <button className="login-with-google-btn" type="button" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
