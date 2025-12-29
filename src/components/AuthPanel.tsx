import { useState } from 'react';
import { loginWithEmail, registerWithEmail } from '../config/auth';
import { User } from 'firebase/auth';

interface AuthPanelProps {
  user: User | null;
}

export default function AuthPanel({ user }: AuthPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Lütfen e-posta ve şifre giriniz');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err: any) {
      let errorMessage = 'Bir hata oluştu';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Şifre yanlış';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanılıyor';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Şifre çok zayıf (en az 6 karakter olmalı)';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'E-posta veya şifre hatalı';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // App.tsx'de çıkış butonu gösterilecek
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            <span className="title-icon">✓</span>
            Modern To-Do List
          </h1>
          <p className="auth-subtitle">
            {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              disabled={loading}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin ? 'Hesabınız yok mu? ' : 'Zaten hesabınız var mı? '}
          </span>
          <button
            type="button"
            className="auth-switch-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            disabled={loading}
          >
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </div>
      </div>
    </div>
  );
}

