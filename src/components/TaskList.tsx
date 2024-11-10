import React from 'react';
import { Task } from '../types';
import { CheckCircle2, AlertCircle, Clock, XCircle, Edit2, Trash2 } from 'lucide-react';
import TaskFilters from './TaskFilters';

interface TaskListProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({ tasks, onUpdateTaskStatus, onEditTask, onDeleteTask }: TaskListProps) {
  const [filter, setFilter] = React.useState<'all' | 'active' | 'completed'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<string | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return task.status === 'pending' || task.status === 'partial';
    if (filter === 'completed') return task.status === 'completed' || task.status === 'skipped';
    return true;
  });

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => t.status === 'pending' || t.status === 'partial').length,
    completed: tasks.filter(t => t.status === 'completed' || t.status === 'skipped').length,
  };

  const handleDeleteClick = (taskId: string) => {
    setShowDeleteConfirm(taskId);
  };

  const handleDeleteConfirm = (taskId: string) => {
    onDeleteTask(taskId);
    setShowDeleteConfirm(null);
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'partial':
        return <Clock className="text-yellow-500" size={20} />;
      case 'skipped':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-blue-500" size={20} />;
    }
  };

  return (
    <div>
      <TaskFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        taskCounts={taskCounts}
      />
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Start: {new Date(task.startDateTime).toLocaleString()}</p>
                  <p>End: {new Date(task.endDateTime).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                    className={`p-2 rounded-full hover:bg-gray-100 ${
                      task.status === 'completed' ? 'bg-green-50' : ''
                    }`}
                  >
                    <CheckCircle2 size={20} className="text-green-500" />
                  </button>
                  <button
                    onClick={() => onUpdateTaskStatus(task.id, 'partial')}
                    className={`p-2 rounded-full hover:bg-gray-100 ${
                      task.status === 'partial' ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <Clock size={20} className="text-yellow-500" />
                  </button>
                  <button
                    onClick={() => onUpdateTaskStatus(task.id, 'skipped')}
                    className={`p-2 rounded-full hover:bg-gray-100 ${
                      task.status === 'skipped' ? 'bg-red-50' : ''
                    }`}
                  >
                    <XCircle size={20} className="text-red-500" />
                  </button>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
            {showDeleteConfirm === task.id && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-red-800 mb-3">Are you sure you want to delete this task?</p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(task.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}