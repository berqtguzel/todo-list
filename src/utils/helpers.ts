import { Todo, TodoStats, Category, Priority } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Bugün';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Yarın';
  } else {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export const isOverdue = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
};

export const calculateStats = (todos: Todo[]): TodoStats => {
  const stats: TodoStats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    byPriority: {
      low: todos.filter(t => t.priority === 'low').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      high: todos.filter(t => t.priority === 'high').length,
    },
    byCategory: {
      work: todos.filter(t => t.category === 'work').length,
      personal: todos.filter(t => t.category === 'personal').length,
      shopping: todos.filter(t => t.category === 'shopping').length,
      health: todos.filter(t => t.category === 'health').length,
      other: todos.filter(t => t.category === 'other').length,
    },
  };
  return stats;
};

export const getCategoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    work: 'İş',
    personal: 'Kişisel',
    shopping: 'Alışveriş',
    health: 'Sağlık',
    other: 'Diğer',
  };
  return labels[category];
};

export const getPriorityLabel = (priority: Priority): string => {
  const labels: Record<Priority, string> = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
  };
  return labels[priority];
};

export const getPriorityColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    low: '#22c55e',
    medium: '#f97316',
    high: '#dc2626',
  };
  return colors[priority];
};

export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    work: '#ea580c',
    personal: '#f97316',
    shopping: '#fb923c',
    health: '#fdba74',
    other: '#fed7aa',
  };
  return colors[category];
};

