import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import { DeleteModal } from '../components/DeleteModal';
import { useTasks } from '../hooks/useTasks';

export function Dashboard() {
  const { deleteTask } = useTasks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

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
        onConfirm={(id) => deleteTask(id)}
      />
    </div>
  );
}
