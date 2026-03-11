import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types/task';
import { loadTasks, saveTasks } from '../utils/localStorage';
import { fetchApiTasks, createApiTask, updateApiTask, deleteApiTask } from '../api/axiosClient';

const PAGE_SIZE = 20;

interface TaskContextProps {
  tasks: Task[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  filter: string;
  searchQuery: string;
  hasMore: boolean;
  fetchTasks: () => Promise<void>;
  loadMoreTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  reorderTasks: (reorderedVisible: Task[]) => void;
  setFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
}

export const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const localTasks = loadTasks();
        if (localTasks && localTasks.length > 0) {
          setTasks(localTasks);
          setOffset(localTasks.length);
          setHasMore(true);
        } else {
          const apiTasks = await fetchApiTasks(0, PAGE_SIZE);
          setTasks(apiTasks);
          saveTasks(apiTasks);
          setOffset(apiTasks.length);
          setHasMore(apiTasks.length === PAGE_SIZE);
        }
      } catch {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const persistAndSet = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const apiTasks = await fetchApiTasks(0, PAGE_SIZE);
      persistAndSet(apiTasks);
      setOffset(apiTasks.length);
      setHasMore(apiTasks.length === PAGE_SIZE);
    } catch {
      setError('Failed to fetch tasks from API.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTasks = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const moreTasks = await fetchApiTasks(offset, PAGE_SIZE);
      if (moreTasks.length === 0) { setHasMore(false); return; }
      const existingIds = new Set(tasks.map(t => t.id));
      const merged = [...tasks, ...moreTasks.filter(t => !existingIds.has(t.id))];
      persistAndSet(merged);
      setOffset(offset + moreTasks.length);
      setHasMore(moreTasks.length === PAGE_SIZE);
    } catch {
      setError('Failed to load more tasks.');
    } finally {
      setLoadingMore(false);
    }
  };

  const addTask = async (taskInput: Partial<Task>) => {
    const defaultTask: Partial<Task> = {
      status: 'todo',
      completed: false,
      userId: 1,
      ...taskInput,
    };
    const newTask = await createApiTask(defaultTask);
    persistAndSet([newTask, ...tasks]);
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    const previousTasks = [...tasks];
    persistAndSet(tasks.map(t => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await updateApiTask(id, updates);
    } catch {
      persistAndSet(previousTasks);
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id: number) => {
    const previousTasks = [...tasks];
    persistAndSet(tasks.filter(t => t.id !== id));
    try {
      await deleteApiTask(id);
    } catch {
      persistAndSet(previousTasks);
      setError('Failed to delete task.');
    }
  };

  // Reorder: accepts the reordered visible (filtered) tasks, merges back into full array
  const reorderTasks = (reorderedVisible: Task[]) => {
    const visibleIds = new Set(reorderedVisible.map(t => t.id));
    let visIdx = 0;
    const result = tasks.map(t => visibleIds.has(t.id) ? reorderedVisible[visIdx++] : t);
    persistAndSet(result);
  };

  return (
    <TaskContext.Provider value={{
      tasks, loading, loadingMore, error, filter, searchQuery, hasMore,
      fetchTasks, loadMoreTasks, addTask, updateTask, deleteTask, reorderTasks,
      setFilter, setSearchQuery,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
