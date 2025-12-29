import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Kayıt ol
export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Giriş yap
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Çıkış yap
export const logout = async () => {
  await signOut(auth);
};
