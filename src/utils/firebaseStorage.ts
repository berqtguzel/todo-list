import { doc, setDoc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { Todo } from '../types';

// Firebase yapılandırılıp yapılandırılmadığını kontrol et
const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== 'YOUR_API_KEY' && apiKey.length > 10;
};

const COLLECTION_NAME = 'todos';
const USER_ID_KEY = 'firebase_user_id';

// Kullanıcı ID'sini al veya oluştur
const getUserId = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Önce mevcut kullanıcıyı kontrol et
    const currentUser = auth.currentUser;
    if (currentUser) {
      localStorage.setItem(USER_ID_KEY, currentUser.uid);
      resolve(currentUser.uid);
      return;
    }

    // Auth state değişikliğini dinle
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // İlk callback'ten sonra unsubscribe et
      
      if (user) {
        localStorage.setItem(USER_ID_KEY, user.uid);
        resolve(user.uid);
      } else {
        // Kullanıcı yoksa anonim olarak giriş yap
        try {
          const userCredential = await signInAnonymously(auth);
          const userId = userCredential.user.uid;
          localStorage.setItem(USER_ID_KEY, userId);
          resolve(userId);
        } catch (error) {
          console.error('Firebase auth error:', error);
          // Fallback: localStorage'dan al veya yeni oluştur
          const storedUserId = localStorage.getItem(USER_ID_KEY);
          if (storedUserId) {
            resolve(storedUserId);
          } else {
            const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem(USER_ID_KEY, newUserId);
            resolve(newUserId);
          }
        }
      }
    });

    // Timeout: 5 saniye içinde auth tamamlanmazsa fallback kullan
    setTimeout(() => {
      unsubscribe();
      const storedUserId = localStorage.getItem(USER_ID_KEY);
      if (storedUserId) {
        resolve(storedUserId);
      } else {
        const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(USER_ID_KEY, newUserId);
        resolve(newUserId);
      }
    }, 5000);
  });
};

// Tüm görevleri kaydet
export const saveTodos = async (todos: Todo[]): Promise<void> => {
  // Önce localStorage'a kaydet (her zaman)
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }

  // Firebase yapılandırılmamışsa sadece localStorage kullan
  if (!isFirebaseConfigured()) {
    return;
  }

  try {
    const userId = await getUserId();
    const userDocRef = doc(db, COLLECTION_NAME, userId);
    
    await setDoc(userDocRef, {
      todos: todos,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Failed to save todos to Firebase:', error);
    // Firebase'e kaydetme başarısız olsa bile localStorage'a kaydedildi
  }
};

// Tüm görevleri yükle
export const loadTodos = async (): Promise<Todo[]> => {
  // Önce localStorage'dan yükle (hızlı başlangıç için)
  let localTodos: Todo[] = [];
  try {
    const stored = localStorage.getItem('todos');
    if (stored) {
      localTodos = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }

  // Firebase yapılandırılmamışsa sadece localStorage kullan
  if (!isFirebaseConfigured()) {
    return localTodos;
  }

  try {
    const userId = await getUserId();
    const userDocRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const firebaseTodos = data.todos || [];
      
      // Firebase'de veri varsa onu kullan, yoksa localStorage'dan yükle
      if (firebaseTodos.length > 0) {
        // Firebase'deki veriyi localStorage'a da kaydet (senkronizasyon için)
        localStorage.setItem('todos', JSON.stringify(firebaseTodos));
        return firebaseTodos;
      } else if (localTodos.length > 0) {
        // Firebase'de veri yok ama localStorage'da var, Firebase'e aktar
        await saveTodos(localTodos);
        return localTodos;
      }
    } else {
      // Firebase'de doküman yok, localStorage'dan yükle ve Firebase'e aktar
      if (localTodos.length > 0) {
        await saveTodos(localTodos);
        return localTodos;
      }
    }
  } catch (error) {
    console.error('Failed to load todos from Firebase:', error);
    // Hata durumunda localStorage'dan döndür
    return localTodos;
  }
  
  return localTodos;
};

// Gerçek zamanlı dinleme (farklı cihazlardan gelen güncellemeleri al)
export const subscribeToTodos = (
  callback: (todos: Todo[]) => void
): (() => void) => {
  // Önce localStorage'dan yükle (hızlı başlangıç)
  try {
    const stored = localStorage.getItem('todos');
    if (stored) {
      callback(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }

  // Firebase yapılandırılmamışsa sadece localStorage kullan (gerçek zamanlı dinleme yok)
  if (!isFirebaseConfigured()) {
    // Boş cleanup fonksiyonu
    return () => {};
  }

  let unsubscribe: (() => void) | null = null;
  
  getUserId().then((userId) => {
    const userDocRef = doc(db, COLLECTION_NAME, userId);
    
    unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const firebaseTodos = data.todos || [];
        // Firebase'den gelen veriyi localStorage'a da kaydet
        localStorage.setItem('todos', JSON.stringify(firebaseTodos));
        callback(firebaseTodos);
      } else {
        // Firebase'de veri yok, localStorage'dan yükle
        try {
          const stored = localStorage.getItem('todos');
          if (stored) {
            const localTodos = JSON.parse(stored);
            callback(localTodos);
            // LocalStorage'dan Firebase'e aktar
            saveTodos(localTodos).catch(console.error);
          }
        } catch (localError) {
          console.error('Failed to load from localStorage:', localError);
        }
      }
    }, (error) => {
      console.error('Firebase subscription error:', error);
      // Hata durumunda localStorage'dan yükle
      try {
        const stored = localStorage.getItem('todos');
        if (stored) {
          callback(JSON.parse(stored));
        }
      } catch (localError) {
        console.error('Failed to load from localStorage:', localError);
      }
    });
  }).catch((error) => {
    console.error('Failed to get user ID:', error);
    // Fallback: localStorage'dan yükle
    try {
      const stored = localStorage.getItem('todos');
      if (stored) {
        callback(JSON.parse(stored));
      }
    } catch (localError) {
      console.error('Failed to load from localStorage:', localError);
    }
  });
  
  // Cleanup fonksiyonu
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

