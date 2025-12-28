import { Todo, Priority, Category } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, priority: Priority, category: Category, dueDate: string | null, notes: string) => void;
  onSelect: (id: string, selected: boolean) => void;
}

export const TodoList = ({ todos, selectedIds, onToggle, onDelete, onUpdate, onSelect }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Henüz görev yok</h3>
        <p>Yeni bir görev ekleyerek başlayın!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isSelected={selectedIds.has(todo.id)}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

