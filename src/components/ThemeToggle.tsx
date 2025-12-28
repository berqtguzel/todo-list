import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const ThemeToggle = ({ theme, onThemeChange }: ThemeToggleProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
      className="theme-toggle"
      aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
      title={theme === 'dark' ? 'Açık tema' : 'Koyu tema'}
    >
      {theme === 'dark' ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 3V1M10 19v-2M17.66 6.34l-1.41-1.41M3.75 16.25l-1.41-1.41M17 10h2M1 10h2M17.66 13.66l-1.41 1.41M3.75 3.75l-1.41 1.41"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

