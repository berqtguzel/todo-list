export type Priority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'active' | 'completed';
export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'other';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byCategory: Record<Category, number>;
}

