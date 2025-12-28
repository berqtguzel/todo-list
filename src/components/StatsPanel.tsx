import { TodoStats } from '../types';

interface StatsPanelProps {
  stats: TodoStats;
}

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Toplam</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.active}</div>
        <div className="stat-label">Aktif</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.completed}</div>
        <div className="stat-label">Tamamlanan</div>
      </div>
      <div className="stat-card highlight">
        <div className="stat-value">{completionPercentage}%</div>
        <div className="stat-label">Tamamlanma</div>
      </div>
    </div>
  );
};

