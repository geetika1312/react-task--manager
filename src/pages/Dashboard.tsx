import { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import { DeleteModal } from '../components/DeleteModal';
import { useTasks } from '../hooks/useTasks';

export function Dashboard() {
  const { deleteTask } = useTasks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'deleted'>('idle');

  const handleDelete = async (id: number) => {
  setDeleteStatus('deleting');

  await deleteTask(id);

  setTaskToDelete(null);
  setDeleteStatus('deleted');

  setTimeout(() => {
    setDeleteStatus('idle');
  }, 2000);
};

  return (
    // Full viewport height, flex column, no overflow — only the inner list scrolls
    <div className="h-screen flex flex-col overflow-hidden bg-background">

      {/* Top navigation — always visible, never scrolls away */}
      <TopBar onAddClick={() => setIsAddModalOpen(true)} />

      {/* Scrollable task area — grows to fill remaining height */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
          <TaskList onDeleteTask={(id) => setTaskToDelete(id)} />
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <DeleteModal
        taskId={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        // onConfirm={(id) => deleteTask(id)}
        onConfirm={handleDelete}
      />
      {deleteStatus !== 'idle' && (
  <div className="fixed bottom-6 right-6 z-50">
    <div className="px-4 py-2 rounded-lg shadow-lg text-sm font-medium bg-card border border-border flex items-center gap-2">
      
      {deleteStatus === 'deleting' && (
        <>
          <span className="animate-pulse">⏳</span>
          Deleting task...
        </>
      )}

      {deleteStatus === 'deleted' && (
        <>
          <span className="text-green-500">✓</span>
          Task deleted
        </>
      )}

    </div>
  </div>
)}
    </div>
  );
}
