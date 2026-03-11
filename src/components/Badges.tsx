import React from 'react';
import { cn } from '@/lib/utils';
import { Priority, Status } from '../types/task';

// Utility for interactive cycle clicking
export function StatusBadge({ status, onClick, className }: { status: Status, onClick?: () => void, className?: string }) {
  const config = {
    todo: { label: 'To Do', classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    in_progress: { label: 'In Progress', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    completed: { label: 'Completed', classes: 'bg-green-500/10 text-green-400 border-green-500/20' },
  };

  const { label, classes } = config[status] || config.todo;

  return (
    <span 
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap transition-colors",
        classes,
        onClick && "cursor-pointer hover:bg-white/5",
        className
      )}
    >
      {label}
    </span>
  );
}

export function PriorityBadge({ priority, onClick, className }: { priority: Priority, onClick?: () => void, className?: string }) {
  const config = {
    low: { label: 'Low', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    medium: { label: 'Medium', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    high: { label: 'High', classes: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };

  const { label, classes } = config[priority] || config.medium;

  return (
    <span 
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap transition-colors",
        classes,
        onClick && "cursor-pointer hover:bg-white/5",
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5", 
        priority === 'high' ? 'bg-red-400' : priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
      )} />
      {label}
    </span>
  );
}
