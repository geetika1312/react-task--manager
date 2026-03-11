type Listener = () => void;

let currentOpenId: string | null = null;
const listeners = new Set<Listener>();

export const dropdownManager = {
  open(id: string) {
    if (currentOpenId !== id) {
      currentOpenId = id;
      listeners.forEach(fn => fn());
    }
  },
  close(id?: string) {
    if (!id || currentOpenId === id) {
      currentOpenId = null;
      listeners.forEach(fn => fn());
    }
  },
  isOpen(id: string) {
    return currentOpenId === id;
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
