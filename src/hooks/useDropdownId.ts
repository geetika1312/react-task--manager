import { useEffect, useRef, useState } from 'react';
import { dropdownManager } from '../utils/dropdownManager';

export function useDropdownId() {
  const id = useRef(`dd-${Math.random().toString(36).slice(2)}`);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = dropdownManager.subscribe(() => {
      setOpen(dropdownManager.isOpen(id.current));
    });
    return unsub;
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdownManager.isOpen(id.current)) {
      dropdownManager.close(id.current);
    } else {
      dropdownManager.open(id.current);
    }
  };

  const close = () => dropdownManager.close(id.current);

  return { open, toggle, close };
}
