import { useState, useEffect, useMemo } from 'react';
import { Todo, FilterType, Priority, Category } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { FilterBar } from './components/FilterBar';
import { StatsPanel } from './components/StatsPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { BackgroundColorPicker } from './components/BackgroundColorPicker';
import { BulkActions } from './components/BulkActions';
import { saveTodos, loadTodos, subscribeToTodos } from './utils/firebaseStorage';
import { generateId, calculateStats } from './utils/helpers';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [backgroundColor, setBackgroundColor] = useState<string>(() => {
    return localStorage.getItem('backgroundColor') || '#f97316';
  });

  useEffect(() => {
    // İlk yükleme
    loadTodos().then((loadedTodos) => {
      setTodos(loadedTodos);
    });

    // Gerçek zamanlı senkronizasyon (farklı cihazlardan gelen güncellemeleri dinle)
    const unsubscribe = subscribeToTodos((syncedTodos) => {
      setTodos(syncedTodos);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Görevler değiştiğinde Firebase'e kaydet (ilk yükleme hariç)
    // İlk yüklemede boş array gelirse kaydetme
    const timeoutId = setTimeout(() => {
      saveTodos(todos).catch((error) => {
        console.error('Failed to save todos:', error);
      });
    }, 500); // 500ms debounce - çok sık kaydetmeyi önler

    return () => {
      clearTimeout(timeoutId);
    };
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Renk parlaklığını ayarla
  const adjustBrightness = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + percent));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + percent));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + percent));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  useEffect(() => {
    localStorage.setItem('backgroundColor', backgroundColor);
    document.documentElement.style.setProperty('--bg-color', backgroundColor);
    // Gradient oluştur (seçilen renkten daha koyu bir ton)
    const darkerColor = adjustBrightness(backgroundColor, -20);
    document.documentElement.style.setProperty('--bg-gradient', `linear-gradient(135deg, ${backgroundColor} 0%, ${darkerColor} 100%)`);
  }, [backgroundColor]);

  const filteredTodos = useMemo(() => {
    let filtered = todos;

    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      // Kategori filtreleme için özel kontrol
      const categoryMap: Record<string, Category> = {
        'work': 'work',
        'personal': 'personal',
        'shopping': 'shopping',
        'health': 'health',
        'other': 'other',
      };
      
      if (categoryMap[query]) {
        filtered = filtered.filter(todo => todo.category === categoryMap[query]);
      } else {
        filtered = filtered.filter(todo =>
          todo.text.toLowerCase().includes(query) ||
          (todo.notes && todo.notes.toLowerCase().includes(query))
        );
      }
    }

    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [todos, filter, searchQuery]);

  const stats = useMemo(() => calculateStats(todos), [todos]);

  const handleAddTodo = (text: string, priority: Priority, category: Category, dueDate: string | null, notes: string) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      priority,
      category,
      dueDate,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleUpdateTodo = (
    id: string,
    text: string,
    priority: Priority,
    category: Category,
    dueDate: string | null,
    notes: string
  ) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, text, priority, category, dueDate, notes, updatedAt: new Date().toISOString() }
          : todo
      )
    );
  };

  const handleSelectTodo = (id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(filteredTodos.map(todo => todo.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBulkComplete = () => {
    setTodos(prev =>
      prev.map(todo =>
        selectedIds.has(todo.id) ? { ...todo, completed: true, updatedAt: new Date().toISOString() } : todo
      )
    );
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    setTodos(prev => prev.filter(todo => !selectedIds.has(todo.id)));
    setSelectedIds(new Set());
  };

  const handleBulkPriorityChange = (priority: Priority) => {
    setTodos(prev =>
      prev.map(todo =>
        selectedIds.has(todo.id) ? { ...todo, priority, updatedAt: new Date().toISOString() } : todo
      )
    );
    setSelectedIds(new Set());
  };

  const handleClearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-content">
          <header className="header">
            <h1 className="title">
              <span className="title-icon">✓</span>
              Modern To-Do List
            </h1>
          </header>
          <div className="header-controls">
            <BackgroundColorPicker backgroundColor={backgroundColor} onColorChange={setBackgroundColor} />
            <ThemeToggle theme={theme} onThemeChange={setTheme} />
          </div>
        </div>
      </div>

      <div className="app-body">
        <aside className="sidebar">
          <StatsPanel stats={stats} />
          <div className="sidebar-section">
            <h3 className="sidebar-title">Hızlı Filtreler</h3>
            <div className="quick-filters">
              <button
                onClick={() => setFilter('all')}
                className={`quick-filter ${filter === 'all' ? 'active' : ''}`}
              >
                Tümü ({stats.total})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`quick-filter ${filter === 'active' ? 'active' : ''}`}
              >
                Aktif ({stats.active})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`quick-filter ${filter === 'completed' ? 'active' : ''}`}
              >
                Tamamlanan ({stats.completed})
              </button>
            </div>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Kategoriler</h3>
            <div className="category-filters">
              {(['work', 'personal', 'shopping', 'health', 'other'] as Category[]).map((cat) => {
                const categoryLabels: Record<Category, string> = {
                  work: 'İş',
                  personal: 'Kişisel',
                  shopping: 'Alışveriş',
                  health: 'Sağlık',
                  other: 'Diğer',
                };
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      if (searchQuery === cat) {
                        setSearchQuery('');
                      } else {
                        setSearchQuery(cat);
                      }
                    }}
                    className={`category-filter ${searchQuery === cat ? 'active' : ''}`}
                  >
                    {stats.byCategory[cat]} {categoryLabels[cat]}
                  </button>
                );
              })}
            </div>
          </div>
          {stats.completed > 0 && (
            <div className="sidebar-section">
              <button onClick={handleClearCompleted} className="clear-button">
                Tamamlananları Temizle
              </button>
            </div>
          )}
        </aside>

        <main className="main-content">
          <TodoForm onSubmit={handleAddTodo} />

          <FilterBar
            currentFilter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {selectedIds.size > 0 && (
            <BulkActions
              selectedIds={selectedIds}
              todos={filteredTodos}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onBulkComplete={handleBulkComplete}
              onBulkDelete={handleBulkDelete}
              onBulkPriorityChange={handleBulkPriorityChange}
            />
          )}

          <TodoList
            todos={filteredTodos}
            selectedIds={selectedIds}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            onSelect={handleSelectTodo}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

