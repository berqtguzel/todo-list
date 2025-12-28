import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

// Başlangıç temasını ayarla
const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', initialTheme);

// Başlangıç arka plan rengini ayarla
const savedBgColor = localStorage.getItem('backgroundColor') || '#f97316';
document.documentElement.style.setProperty('--bg-color', savedBgColor);
const adjustBrightness = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + percent));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
const darkerColor = adjustBrightness(savedBgColor, -20);
document.documentElement.style.setProperty('--bg-gradient', `linear-gradient(135deg, ${savedBgColor} 0%, ${darkerColor} 100%)`);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

