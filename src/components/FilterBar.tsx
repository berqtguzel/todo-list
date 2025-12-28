import { FilterType } from '../types';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar = ({ currentFilter, onFilterChange, onSearchChange, searchQuery }: FilterBarProps) => {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Görevlerde ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="clear-search"
            aria-label="Aramayı temizle"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="filter-buttons">
        <button
          onClick={() => onFilterChange('all')}
          className={`filter-button ${currentFilter === 'all' ? 'active' : ''}`}
        >
          Tümü
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`filter-button ${currentFilter === 'active' ? 'active' : ''}`}
        >
          Aktif
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`filter-button ${currentFilter === 'completed' ? 'active' : ''}`}
        >
          Tamamlanan
        </button>
      </div>
    </div>
  );
};

