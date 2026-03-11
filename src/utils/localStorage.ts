import { Task } from '../types/task';

const STORAGE_KEY = 'taskflow_data_v1';

export const loadTasks = (): Task[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing tasks from local storage', error);
    return null;
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to local storage', error);
  }
};
