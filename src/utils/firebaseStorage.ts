import { doc, setDoc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { Todo } from '../types';

const COLLECTION_NAME = 'todos';

// Auth zorunlu helper
const requireUser = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser;
    if (user?.uid) {
      resolve(user.uid);
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      if (u?.uid) resolve(u.uid);
      else reject(new Error('User not authenticated'));
    });
  });
};

// -------- SAVE --------
export const saveTodos = async (todos: Todo[]) => {
  const userId = await requireUser();
  const ref = doc(db, COLLECTION_NAME, userId);

  await setDoc(
    ref,
    {
      todos,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

// -------- LOAD --------
export const loadTodos = async (): Promise<Todo[]> => {
  const userId = await requireUser();
  const ref = doc(db, COLLECTION_NAME, userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return [];
  return (snap.data().todos || []) as Todo[];
};

// -------- REALTIME --------
export const subscribeToTodos = (
  userId: string, 
  cb: (todos: Todo[], hasPendingWrites: boolean) => void
): (() => void) => {
  const ref = doc(db, COLLECTION_NAME, userId);
  
  const unsubSnapshot = onSnapshot(
    ref,
    (snap) => {
      const data = snap.data();
      const todos = (data?.todos || []) as Todo[];
      const hasPendingWrites = snap.metadata.hasPendingWrites;
      cb(todos, hasPendingWrites);
    },
    (error) => {
      console.error('Error in subscribeToTodos:', error);
    }
  );

  return () => {
    unsubSnapshot();
  };
};
