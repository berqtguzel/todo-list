import { useState } from 'react';
import { Todo, Priority, Category } from '../types';
import {
  formatDate,
  isOverdue,
  getPriorityColor,
  getCategoryColor,
  getPriorityLabel,
  getCategoryLabel,
} from '../utils/helpers';

interface TodoItemProps {
  todo: Todo;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, priority: Priority, category: Category, dueDate: string | null, notes: string) => void;
  onSelect: (id: string, selected: boolean) => void;
}

export const TodoItem = ({ todo, isSelected, onToggle, onDelete, onUpdate, onSelect }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editNotes, setEditNotes] = useState(todo.notes || '');

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim(), editPriority, editCategory, editDueDate || null, editNotes);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate || '');
    setEditNotes(todo.notes || '');
    setIsEditing(false);
  };

  const overdue = isOverdue(todo.dueDate);

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <div className="edit-options">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="select-input small"
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as Category)}
              className="select-input small"
            >
              <option value="work">İş</option>
              <option value="personal">Kişisel</option>
              <option value="shopping">Alışveriş</option>
              <option value="health">Sağlık</option>
              <option value="other">Diğer</option>
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="date-input small"
            />
          </div>
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Notlar..."
            className="edit-notes"
            rows={3}
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="save-button">
              Kaydet
            </button>
            <button onClick={handleCancel} className="cancel-button">
              İptal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''} ${isSelected ? 'selected' : ''}`}>
      <div className="todo-content">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(todo.id, !isSelected);
          }}
          className={`select-checkbox ${isSelected ? 'checked' : ''}`}
          aria-label={isSelected ? 'Seçimi kaldır' : 'Seç'}
        >
          {isSelected && (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4L6 11.5L2.5 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <button
          onClick={() => onToggle(todo.id)}
          className={`checkbox ${todo.completed ? 'checked' : ''}`}
          aria-label={todo.completed ? 'Tamamlandı olarak işaretle' : 'Tamamlanmadı olarak işaretle'}
        >
          {todo.completed && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4L6 11.5L2.5 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div className="todo-text-wrapper">
          <p className="todo-text">{todo.text}</p>
          <div className="todo-meta">
            <span
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(todo.priority) + '20', color: getPriorityColor(todo.priority) }}
            >
              {getPriorityLabel(todo.priority)}
            </span>
            <span
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(todo.category) + '20', color: getCategoryColor(todo.category) }}
            >
              {getCategoryLabel(todo.category)}
            </span>
            {todo.dueDate && (
              <span className={`due-date ${overdue ? 'overdue-text' : ''}`}>
                📅 {formatDate(todo.dueDate)}
              </span>
            )}
            {todo.notes && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="notes-toggle"
                title="Notları göster/gizle"
              >
                📝 Notlar
              </button>
            )}
          </div>
          {showNotes && todo.notes && (
            <div className="todo-notes">
              <p>{todo.notes}</p>
            </div>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="action-button edit"
          aria-label="Düzenle"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M11.333 2a1.414 1.414 0 0 1 2 2L5.333 12l-3 1 1-3L11.333 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="action-button delete"
          aria-label="Sil"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4h12M6 4V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-5 0h6m-6 0v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

