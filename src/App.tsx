import React, { useState } from 'react';
import { Target, Plus, ArrowLeft } from 'lucide-react';
import GoalCard from './components/GoalCard';
import TaskList from './components/TaskList';
import Modal from './components/Modal';
import Confetti from './components/Confetti';
import { Goal, Task } from './types';

function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    startDateTime: '',
    endDateTime: '',
  });

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    if (editingGoal) {
      const updatedGoals = goals.map(g => g.id === editingGoal.id ? { ...g, title: newGoalTitle } : g);
      setGoals(updatedGoals);
      if (selectedGoal?.id === editingGoal.id) {
        setSelectedGoal({ ...selectedGoal, title: newGoalTitle });
      }
    } else {
      setGoals(prevGoals => [...prevGoals, newGoal]);
    }

    setNewGoalTitle('');
    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  const handleAddTask = () => {
    if (!selectedGoal || !newTaskData.title || !newTaskData.startDateTime || !newTaskData.endDateTime) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskData.title,
      startDateTime: newTaskData.startDateTime,
      endDateTime: newTaskData.endDateTime,
      status: 'pending',
    };

    const updatedGoals = goals.map(g => {
      if (g.id === selectedGoal.id) {
        const updatedTasks = editingTask
          ? g.tasks.map(t => t.id === editingTask.id ? { ...newTask, id: t.id } : t)
          : [...g.tasks, newTask];
        return { ...g, tasks: updatedTasks };
      }
      return g;
    });

    setGoals(updatedGoals);
    setSelectedGoal(updatedGoals.find(g => g.id === selectedGoal.id) || null);
    setNewTaskData({ title: '', startDateTime: '', endDateTime: '' });
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setIsAddingTask(false);
  };

  const handleUpdateTaskStatus = (taskId: string, status: Task['status']) => {
    if (status === 'completed') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    const updatedGoals = goals.map(g => ({
      ...g,
      tasks: g.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));

    setGoals(updatedGoals);
    if (selectedGoal) {
      setSelectedGoal(updatedGoals.find(g => g.id === selectedGoal.id) || null);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal and all its tasks?')) {
      setGoals(prevGoals => prevGoals.filter(g => g.id !== goalId));
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(null);
        setIsAddingTask(false);
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedGoals = goals.map(g => ({
      ...g,
      tasks: g.tasks.filter(t => t.id !== taskId)
    }));

    setGoals(updatedGoals);
    if (selectedGoal) {
      setSelectedGoal(updatedGoals.find(g => g.id === selectedGoal.id) || null);
    }
  };

  const handleModalClose = () => {
    if (newGoalTitle.trim() || (newTaskData.title.trim() && newTaskData.startDateTime && newTaskData.endDateTime)) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        if (isGoalModalOpen) {
          setNewGoalTitle('');
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        } else {
          setNewTaskData({ title: '', startDateTime: '', endDateTime: '' });
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setIsAddingTask(false);
        }
      }
    } else {
      if (isGoalModalOpen) {
        setIsGoalModalOpen(false);
        setEditingGoal(null);
      } else {
        setIsTaskModalOpen(false);
        setEditingTask(null);
        setIsAddingTask(false);
      }
    }
  };

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddingTask(false);
  };

  const handleBackToGoals = () => {
    setSelectedGoal(null);
    setIsAddingTask(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Confetti isVisible={showConfetti} />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {(selectedGoal || isAddingTask) ? (
                <button
                  onClick={handleBackToGoals}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={24} />
                  <span className="font-medium">Back to Goals</span>
                </button>
              ) : (
                <>
                  <Target className="text-indigo-600" size={24} />
                  <h1 className="text-2xl font-bold text-gray-900">Goal Tracker</h1>
                </>
              )}
            </div>
            {!selectedGoal && !isAddingTask && (
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setNewGoalTitle('');
                  setIsGoalModalOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
                Add Goal
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedGoal && !isAddingTask ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEditGoal={(goal) => {
                  setEditingGoal(goal);
                  setNewGoalTitle(goal.title);
                  setIsGoalModalOpen(true);
                }}
                onDeleteGoal={handleDeleteGoal}
                onAddTask={(goalId) => {
                  const goal = goals.find(g => g.id === goalId);
                  if (goal) {
                    setSelectedGoal(goal);
                    setIsAddingTask(true);
                    setEditingTask(null);
                    setNewTaskData({ title: '', startDateTime: '', endDateTime: '' });
                    setIsTaskModalOpen(true);
                  }
                }}
                onSelect={handleGoalSelect}
              />
            ))}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedGoal?.title}</h2>
              {!isAddingTask && (
                <button
                  onClick={() => {
                    setIsAddingTask(true);
                    setIsTaskModalOpen(true);
                  }}
                  className="mt-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={20} />
                  Add New Task
                </button>
              )}
            </div>
            <TaskList
              tasks={selectedGoal?.tasks || []}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onEditTask={(task) => {
                setEditingTask(task);
                setNewTaskData({
                  title: task.title,
                  startDateTime: task.startDateTime,
                  endDateTime: task.endDateTime,
                });
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}
      </main>

      <Modal
        isOpen={isGoalModalOpen}
        onClose={handleModalClose}
        title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Enter goal title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={!newGoalTitle.trim()}
            >
              {editingGoal ? 'Update Goal' : 'Add Goal'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={handleModalClose}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newTaskData.title}
            onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
            placeholder="Enter task title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
            <input
              type="datetime-local"
              value={newTaskData.startDateTime}
              onChange={(e) => setNewTaskData({ ...newTaskData, startDateTime: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              value={newTaskData.endDateTime}
              onChange={(e) => setNewTaskData({ ...newTaskData, endDateTime: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={!newTaskData.title.trim() || !newTaskData.startDateTime || !newTaskData.endDateTime}
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;