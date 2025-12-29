import { Todo } from '../types';

interface BulkActionsProps {
  selectedIds: Set<string>;
  todos: Todo[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onBulkPriorityChange: (priority: 'low' | 'medium' | 'high') => void;
}

export const BulkActions = ({
  selectedIds,
  todos,
  onSelectAll,
  onDeselectAll,
  onBulkComplete,
  onBulkDelete,
  onBulkPriorityChange,
}: BulkActionsProps) => {
  const allSelected = selectedIds.size === todos.length && todos.length > 0;

  if (selectedIds.size === 0) {
    return null;
  }

  return (
    <div className="bulk-actions">
      <div className="bulk-actions-info">
        <span className="bulk-count">{selectedIds.size} görev seçildi</span>
        <div className="bulk-select-controls">
          <button onClick={allSelected ? onDeselectAll : onSelectAll} className="bulk-select-button">
            {allSelected ? 'Tümünü Kaldır' : 'Tümünü Seç'}
          </button>
        </div>
      </div>
      <div className="bulk-actions-buttons">
        <button onClick={onBulkComplete} className="bulk-button complete">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tamamla
        </button>
        <div className="bulk-priority-dropdown">
          <button className="bulk-button priority">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Öncelik
          </button>
          <div className="bulk-priority-menu">
            <button onClick={() => onBulkPriorityChange('high')} className="priority-option high">
              Yüksek
            </button>
            <button onClick={() => onBulkPriorityChange('medium')} className="priority-option medium">
              Orta
            </button>
            <button onClick={() => onBulkPriorityChange('low')} className="priority-option low">
              Düşük
            </button>
          </div>
        </div>
        <button onClick={onBulkDelete} className="bulk-button delete">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M6 4V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-5 0h6m-6 0v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sil
        </button>
      </div>
    </div>
  );
};

