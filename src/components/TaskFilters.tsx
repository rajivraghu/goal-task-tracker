import React from 'react';

type FilterType = 'all' | 'active' | 'completed';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function TaskFilters({ currentFilter, onFilterChange, taskCounts }: TaskFiltersProps) {
  const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: `All (${taskCounts.all})` },
    { type: 'active', label: `Active (${taskCounts.active})` },
    { type: 'completed', label: `Completed (${taskCounts.completed})` },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {filters.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentFilter === type
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}