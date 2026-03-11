import React, { useRef, useEffect } from 'react';
import { Status, Priority } from '../types/task';
import { cn } from '@/lib/utils';
import { ChevronDown, Calendar as CalendarIcon, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useDropdownId } from '../hooks/useDropdownId';

// ─── Shared Floating Menu ─────────────────────────────────────────────────

interface DropdownOption {
  value: string;
  label: string;
  dot?: string;
}

function FloatingMenu({ options, current, onSelect, onClose }: {
  options: DropdownOption[];
  current: string;
  onSelect: (val: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Slight delay so the opening click doesn't immediately re-trigger the handler
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
  }, [onClose]);

  return (
    <div
      ref={ref}
      // z-10 is enough here since the PARENT wrapper already has z-50 when open
      className="absolute left-0 top-full mt-1.5 z-10 rounded-xl p-1.5 min-w-[170px] w-max"
      style={{
        background: '#0e0f1c',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.8)',
      }}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(opt.value);
            onClose();
          }}
          className={cn(
            "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 transition-colors",
            "hover:bg-white/10 active:bg-white/15",
            current === opt.value
              ? "bg-white/8 font-semibold text-white"
              : "font-normal text-gray-300"
          )}
        >
          {opt.dot && <span className={cn("w-2 h-2 rounded-full shrink-0", opt.dot)} />}
          <span className="flex-1">{opt.label}</span>
          {current === opt.value && (
            <Check className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Status Select ────────────────────────────────────────────────────────

const STATUS_OPTIONS: DropdownOption[] = [
  { value: 'todo',        label: 'To Do',       dot: 'bg-slate-400' },
  { value: 'in_progress', label: 'In Progress', dot: 'bg-blue-400'  },
  { value: 'completed',   label: 'Completed',   dot: 'bg-green-400' },
];

const STATUS_STYLES: Record<Status, string> = {
  todo:        'text-slate-300  bg-slate-500/20  border-slate-500/30',
  in_progress: 'text-blue-300   bg-blue-500/20   border-blue-500/30',
  completed:   'text-green-300  bg-green-500/20  border-green-500/30',
};

const STATUS_DOT: Record<Status, string> = {
  todo: 'bg-slate-400', in_progress: 'bg-blue-400', completed: 'bg-green-400',
};

const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do', in_progress: 'In Progress', completed: 'Completed',
};

export function StatusSelect({ status, onChange }: { status: Status; onChange: (s: Status) => void }) {
  const { open, toggle, close } = useDropdownId();

  return (
    // When open, z-50 elevates this wrapper above all sibling rows in the table
    <div className={cn("relative inline-flex", open ? "z-50" : "z-auto")}>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer transition-all hover:opacity-80 select-none",
          STATUS_STYLES[status]
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[status])} />
        {STATUS_LABELS[status]}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
      {open && (
        <FloatingMenu
          options={STATUS_OPTIONS}
          current={status}
          onSelect={v => onChange(v as Status)}
          onClose={close}
        />
      )}
    </div>
  );
}

// ─── Checkbox Status ──────────────────────────────────────────────────────

export function CheckboxStatus({ status, onChange }: { status: Status; onChange: (s: Status) => void }) {
  const { open, toggle, close } = useDropdownId();

  return (
    <div className={cn("relative inline-flex", open ? "z-50" : "z-auto")}>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 select-none",
          status === 'completed'
            ? "bg-green-500 border-green-500 text-white"
            : status === 'in_progress'
            ? "bg-blue-500/20 border-blue-500 text-blue-400"
            : "border-muted-foreground/50 hover:border-primary hover:bg-primary/10"
        )}
      >
        {status === 'completed' && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === 'in_progress' && (
          <span className="w-2 h-2 rounded-sm bg-blue-400 block" />
        )}
      </button>
      {open && (
        <FloatingMenu
          options={STATUS_OPTIONS}
          current={status}
          onSelect={v => onChange(v as Status)}
          onClose={close}
        />
      )}
    </div>
  );
}

// ─── Priority Select ──────────────────────────────────────────────────────

const PRIORITY_OPTIONS: DropdownOption[] = [
  { value: '',       label: '— None',  dot: 'bg-muted-foreground/30' },
  { value: 'low',    label: 'Low',     dot: 'bg-blue-400'  },
  { value: 'medium', label: 'Medium',  dot: 'bg-yellow-400' },
  { value: 'high',   label: 'High',    dot: 'bg-red-400'   },
];

const PRIORITY_DOT: Record<string, string> = {
  low: 'bg-blue-400', medium: 'bg-yellow-400', high: 'bg-red-400',
};

const PRIORITY_TEXT: Record<string, string> = {
  low: 'text-blue-300', medium: 'text-yellow-300', high: 'text-red-400',
};

export function PrioritySelect({ priority, onChange }: {
  priority?: Priority;
  onChange: (p: Priority | undefined) => void;
}) {
  const { open, toggle, close } = useDropdownId();
  const isEmpty = !priority;

  return (
    <div className={cn("relative inline-flex", open ? "z-50" : "z-auto")}>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 border border-border/40 rounded text-xs font-medium cursor-pointer transition-colors hover:bg-white/5 select-none",
          isEmpty ? "text-muted-foreground/50" : PRIORITY_TEXT[priority!]
        )}
      >
        <span className={cn(
          "w-2 h-2 rounded-full",
          isEmpty ? "bg-muted-foreground/20" : PRIORITY_DOT[priority!]
        )} />
        {isEmpty ? '—' : priority!.charAt(0).toUpperCase() + priority!.slice(1)}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
      {open && (
        <FloatingMenu
          options={PRIORITY_OPTIONS}
          current={priority ?? ''}
          onSelect={v => onChange(v === '' ? undefined : v as Priority)}
          onClose={close}
        />
      )}
    </div>
  );
}

// ─── Date Select ──────────────────────────────────────────────────────────

export function DateSelect({ date, onChange, isOverdue }: {
  date?: string;
  onChange: (d: string | undefined) => void;
  isOverdue?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const localValue = date ? new Date(date).toISOString().split('T')[0] : '';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      try { inputRef.current.showPicker(); } catch { inputRef.current.focus(); }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val ? new Date(val + 'T12:00:00').toISOString() : undefined);
  };

  const displayDate = localValue
    ? (() => {
        try { return format(new Date(localValue + 'T12:00:00'), 'MMM d, yyyy'); }
        catch { return 'Invalid'; }
      })()
    : '—';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-colors hover:bg-white/5 select-none",
          isOverdue
            ? "text-red-400 bg-red-400/10 hover:bg-red-400/15"
            : localValue
            ? "text-muted-foreground"
            : "text-muted-foreground/50"
        )}
      >
        <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
        <span>{displayDate}</span>
      </button>
      <input
        ref={inputRef}
        type="date"
        value={localValue}
        onChange={handleChange}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        tabIndex={-1}
        style={{ colorScheme: 'dark' }}
      />
    </div>
  );
}
