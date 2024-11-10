import React from 'react';
import { Edit2, Trash2, Plus, CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';
import { Goal, Task } from '../types';

interface GoalCardProps {
  goal: Goal;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onAddTask: (goalId: string) => void;
  onSelect: (goal: Goal) => void;
}

export default function GoalCard({ goal, onEditGoal, onDeleteGoal, onAddTask, onSelect }: GoalCardProps) {
  const getTaskStats = () => {
    const total = goal.tasks.length;
    const completed = goal.tasks.filter(t => t.status === 'completed').length;
    const partial = goal.tasks.filter(t => t.status === 'partial').length;
    const skipped = goal.tasks.filter(t => t.status === 'skipped').length;
    const pending = goal.tasks.filter(t => t.status === 'pending').length;
    return { total, completed, partial, skipped, pending };
  };

  const stats = getTaskStats();

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => onSelect(goal)}
    >
      <div className="flex justify-between items-start mb-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEditGoal(goal)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDeleteGoal(goal.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-semibold">{stats.total}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm text-green-600">Completed</span>
          <span className="text-lg font-semibold text-green-700">{stats.completed}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
          <span className="text-sm text-yellow-600">Partial</span>
          <span className="text-lg font-semibold text-yellow-700">{stats.partial}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
          <span className="text-sm text-red-600">Skipped</span>
          <span className="text-lg font-semibold text-red-700">{stats.skipped}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-600">Pending</span>
          <span className="text-lg font-semibold text-blue-700">{stats.pending}</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddTask(goal.id);
        }}
        className="w-full py-3 px-4 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors"
      >
        <Plus size={18} />
        Add New Task
      </button>
    </div>
  );
}