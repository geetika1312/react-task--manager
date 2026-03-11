import { useContext, useMemo } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Task } from '../types/task';

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');

  const { tasks, filter, searchQuery } = context;

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filter !== 'all') result = result.filter(t => t.status === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }
    return result;
  }, [tasks, filter, searchQuery]);

  const tasksByStatus = useMemo(() => {
    const todo: Task[] = [];
    const in_progress: Task[] = [];
    const completed: Task[] = [];
    filteredTasks.forEach(t => {
      if (t.status === 'completed') completed.push(t);
      else if (t.status === 'in_progress') in_progress.push(t);
      else todo.push(t);
    });
    return { todo, in_progress, completed };
  }, [filteredTasks]);

  return { ...context, filteredTasks, tasksByStatus };
};
