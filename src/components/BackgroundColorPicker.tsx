import { useState, useRef, useEffect } from 'react';

interface BackgroundColorPickerProps {
  backgroundColor: string;
  onColorChange: (color: string) => void;
}

const presetColors = [
  { name: 'Turuncu', value: '#f97316' },
  { name: 'Kırmızı', value: '#dc2626' },
  { name: 'Pembe', value: '#ec4899' },
  { name: 'Mor', value: '#a855f7' },
  { name: 'Mavi', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Yeşil', value: '#10b981' },
  { name: 'Sarı', value: '#eab308' },
  { name: 'Lacivert', value: '#1e40af' },
  { name: 'Siyah', value: '#1f2937' },
];

export const BackgroundColorPicker = ({ backgroundColor, onColorChange }: BackgroundColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(backgroundColor);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePresetClick = (color: string) => {
    setCustomColor(color);
    onColorChange(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorChange(color);
  };

  return (
    <div className="bg-color-picker-wrapper" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-color-picker-button"
        aria-label="Arka plan rengini değiştir"
        title="Arka plan rengini değiştir"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="10" r="3" fill="currentColor" />
        </svg>
        <span className="bg-color-preview" style={{ backgroundColor }} />
      </button>

      {isOpen && (
        <div className="bg-color-picker-dropdown">
          <div className="bg-color-picker-section">
            <label className="bg-color-picker-label">Hazır Renkler</label>
            <div className="preset-colors">
              {presetColors.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetClick(preset.value)}
                  className="preset-color-button"
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                  aria-label={preset.name}
                >
                  {backgroundColor === preset.value && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.5 4L6 11.5L2.5 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-color-picker-section">
            <label className="bg-color-picker-label">Özel Renk</label>
            <div className="custom-color-input-wrapper">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="custom-color-input"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  const color = e.target.value;
                  setCustomColor(color);
                  if (/^#[0-9A-F]{6}$/i.test(color)) {
                    onColorChange(color);
                  }
                }}
                className="custom-color-text"
                placeholder="#f97316"
                pattern="^#[0-9A-F]{6}$"
              />
            </div>
          </div>

          <button
            onClick={() => {
              const defaultColor = '#f97316';
              setCustomColor(defaultColor);
              onColorChange(defaultColor);
              setIsOpen(false);
            }}
            className="reset-color-button"
          >
            Varsayılana Dön
          </button>
        </div>
      )}
    </div>
  );
};

