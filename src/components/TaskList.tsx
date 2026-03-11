import React from 'react';
import { TaskRow } from './TaskRow';
import { useTasks } from '../hooks/useTasks';
import { Inbox, Loader2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export function TaskList({ onDeleteTask }: { onDeleteTask: (id: number) => void }) {
  const { filteredTasks, loading, loadingMore, hasMore, loadMoreTasks, reorderTasks } = useTasks();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredTasks.findIndex(t => t.id === active.id);
    const newIndex = filteredTasks.findIndex(t => t.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderTasks(arrayMove(filteredTasks, oldIndex, newIndex));
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-11 bg-white/5 animate-pulse rounded-lg border border-border/30" />
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-card border border-border rounded-full flex items-center justify-center mb-4 shadow-xl">
          <Inbox className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No tasks found</h3>
        <p className="text-muted-foreground text-sm">
          Try changing your search or filter, or create a new task.
        </p>
      </div>
    );
  }

  // Load More is only shown when there are enough results to justify loading more.
  // Hiding it when filtered results are fewer than 20 prevents the confusing case
  // where the button exists but the filter would hide most loaded tasks.
  const showLoadMore = filteredTasks.length >= 20 && hasMore;

  return (
    <div>
      {/* Column headers — sticky at top-0 within the scrollable container */}
      <div className="grid grid-cols-[32px_28px_minmax(180px,1fr)_155px_120px_155px_44px] gap-2 px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border border-border bg-card/60 sticky top-0 z-20 backdrop-blur-md rounded-t-lg">
        <div />
        <div />
        <div>Task Name</div>
        <div>Due Date</div>
        <div>Priority</div>
        <div>Status</div>
        <div />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={filteredTasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-card border border-t-0 border-border rounded-b-lg overflow-visible">
            {filteredTasks.map(task => (
              <TaskRow key={task.id} task={task} onDelete={onDeleteTask} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Load More — only shown when ≥20 filtered results exist and more are available */}
      {showLoadMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMoreTasks}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-white/5 transition-all disabled:opacity-60 shadow-sm"
          >
            {loadingMore
              ? <><Loader2 className="w-4 h-4 animate-spin" />Loading...</>
              : <>Load More Tasks</>
            }
          </button>
        </div>
      )}

      {!hasMore && filteredTasks.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-4 opacity-50">
          All tasks loaded · {filteredTasks.length} total
        </p>
      )}
    </div>
  );
}
