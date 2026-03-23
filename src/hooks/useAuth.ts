import { useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ERROR_MESSAGES } from '../constants';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getErrorMessage = useCallback((error: AuthError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Email not registered. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'Email already registered. Please log in.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed. Please contact support.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      default:
        return ERROR_MESSAGES.LOGIN_FAILED;
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, [getErrorMessage]);

  const signupWithEmail = useCallback(async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      setError('');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with display name
      await result.user.getIdTokenResult();
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, [getErrorMessage]);

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      const message = err.code === 'auth/popup-closed-by-user' 
        ? 'Sign-in was cancelled.' 
        : getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, [getErrorMessage]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setError('');
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      const message = 'Failed to log out. Please try again.';
      setError(message);
      throw new Error(message);
    }
  }, []);

  return {
    user,
    loading,
    error,
    setError,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    logout,
  };
};
