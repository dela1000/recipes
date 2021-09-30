// Firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import firebaseApp, { db } from '../../firebase';

export const IsLoggedIn = () => {
  const auth = getAuth(firebaseApp);
  return useAuthState(auth);
};

export const signInWithGoogle = () => {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).then(async (result) => {
    if (result.user) {
      await setDoc(doc(db, 'users', result.user.uid), {});
      return result.user;
    }
    return null;
  });
};

export const signOut = () => {
  const auth = getAuth(firebaseApp);
  auth.signOut();
};
