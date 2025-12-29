import { useState, FormEvent } from 'react';
import { Priority, Category } from '../types';

interface TodoFormProps {
  onSubmit: (text: string, priority: Priority, category: Category, dueDate: string | null, notes: string) => void;
}

export const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('other');
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim(), priority, category, dueDate || null, notes);
      setText('');
      setDueDate('');
      setNotes('');
      setPriority('medium');
      setCategory('other');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Yeni görev ekle..."
          className="todo-input"
          autoFocus
        />
        <button type="submit" className="add-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12M4 10h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Ekle
        </button>
      </div>
      <div className="form-options">
        <div className="option-group">
          <label>Öncelik:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="select-input"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
        </div>
        <div className="option-group">
          <label>Kategori:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="select-input"
          >
            <option value="work">İş</option>
            <option value="personal">Kişisel</option>
            <option value="shopping">Alışveriş</option>
            <option value="health">Sağlık</option>
            <option value="other">Diğer</option>
          </select>
        </div>
        <div className="option-group">
          <label>Bitiş Tarihi:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div className="form-notes">
        <label>Notlar (Opsiyonel):</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Görev hakkında notlar ekleyin..."
          className="notes-input"
          rows={2}
        />
      </div>
    </form>
  );
};

