import axios from 'axios';
import { Task } from '../types/task';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

const getRandomPriority = (id: number): 'low' | 'medium' | 'high' => {
  const hash = id % 3;
  if (hash === 0) return 'high';
  if (hash === 1) return 'medium';
  return 'low';
};

const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const fetchApiTasks = async (start: number = 0, limit: number = 20): Promise<Task[]> => {
  const { data } = await api.get(`/todos?_start=${start}&_limit=${limit}`);

  return data.map((item: any) => {
    const status = item.completed ? 'completed' : (item.id % 4 === 0 ? 'in_progress' : 'todo');
    return {
      id: item.id,
      title: item.title,
      completed: item.completed,
      userId: item.userId,
      status,
      priority: getRandomPriority(item.id),
      dueDate: item.id % 5 === 0 ? undefined : getFutureDate((item.id % 10) - 2),
      description: 'This task was imported from the public API and requires further elaboration. Edit me!',
    };
  });
};

export const createApiTask = async (task: Partial<Task>): Promise<Task> => {
  await api.post('/todos', task);
  return { ...task, id: Date.now() } as Task;
};

export const updateApiTask = async (id: number, updates: Partial<Task>): Promise<any> => {
  if (id > 200) return updates;
  try {
    const { data } = await api.patch(`/todos/${id}`, updates);
    return data;
  } catch {
    return updates;
  }
};

export const deleteApiTask = async (id: number): Promise<void> => {
  if (id > 200) return;
  try {
    await api.delete(`/todos/${id}`);
  } catch {
    // silent
  }
};
