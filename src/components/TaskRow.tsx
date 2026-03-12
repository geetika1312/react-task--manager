import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, GripVertical } from 'lucide-react';
import { isBefore, startOfDay } from 'date-fns';
import { Task } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import { CheckboxStatus, StatusSelect, PrioritySelect, DateSelect } from './InlineSelect';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskRowProps {
  task: Task;
  onDelete: (id: number) => void;
}

export function TaskRow({ task, onDelete }: TaskRowProps) {
  const { updateTask } = useTasks();
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isCompleted = task.status === 'completed';

  const isOverdue =
    !!task.dueDate &&
    isBefore(startOfDay(new Date(task.dueDate)), startOfDay(new Date())) &&
    !isCompleted;

  useEffect(() => { setTitle(task.title); }, [task.title]);
  useEffect(() => { if (isEditingTitle) titleInputRef.current?.focus(); }, [isEditingTitle]);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) updateTask(task.id, { title: trimmed });
    else setTitle(task.title);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group grid grid-cols-[32px_28px_minmax(180px,1fr)_155px_120px_155px_44px] gap-2 items-center px-3 py-2.5 border-b border-border/30 hover:bg-white/[0.025] transition-colors",
        // NOTE: do NOT set opacity on this container — it creates a stacking context
        // that would trap dropdown z-indexes. Dim individual non-interactive children instead.
        isDragging && "z-50 bg-card shadow-2xl rounded-lg"
      )}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className={cn(
          "flex items-center justify-center w-8 h-8 cursor-grab active:cursor-grabbing transition-colors touch-none select-none",
          isCompleted ? "text-muted-foreground/15" : "text-muted-foreground/20 hover:text-muted-foreground/60"
        )}
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Checkbox — opens status dropdown */}
      <div className="flex items-center justify-center">
        <CheckboxStatus
          status={task.status}
          onChange={(s) => updateTask(task.id, { status: s, completed: s === 'completed' })}
        />
      </div>

      {/* Title — click → detail page, double-click → inline edit */}
      <div className="flex items-center overflow-hidden min-w-0">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={e => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') { setIsEditingTitle(false); setTitle(task.title); }
            }}
            onClick={e => e.stopPropagation()}
            className="w-full bg-black/20 border border-primary/50 rounded px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        ) : (
          <span
            onClick={() => navigate(`/tasks/${task.id}`)}
            onDoubleClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
            title="Click to open · Double-click to edit title"
            className={cn(
              "text-sm font-medium truncate cursor-pointer hover:text-primary transition-colors",
              isCompleted
                ? "line-through text-muted-foreground/50"
                : "text-foreground"
            )}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Due Date — dim text for completed, but keep interactive */}
      <div className={isCompleted ? "opacity-50" : undefined}>
        <DateSelect
          date={task.dueDate}
          onChange={(d) => updateTask(task.id, { dueDate: d })}
          isOverdue={isOverdue}
        />
      </div>

      {/* Priority — fully interactive even for completed tasks */}
      <div>
        <PrioritySelect
          priority={task.priority}
          onChange={(p) => updateTask(task.id, { priority: p })}
        />
      </div>

      {/* Status — fully interactive */}
      <div>
        <StatusSelect
          status={task.status}
          onChange={(s) => updateTask(task.id, { status: s, completed: s === 'completed' })}
        />
      </div>

      {/* Delete */}
      <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
