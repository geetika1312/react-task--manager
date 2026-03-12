import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  taskId: number | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export function DeleteModal({ taskId, onClose, onConfirm }: DeleteModalProps) {
  if (taskId === null) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden"
        >
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Task</h3>
            <p className="text-muted-foreground text-sm">
              Are you sure you want to delete this task? This action cannot be undone and will remove it permanently.
            </p>
          </div>
          
          <div className="bg-background/50 px-6 py-4 flex justify-end gap-3 border-t border-border/50">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-foreground hover:bg-white/5 transition-colors border border-border hover:border-border/80"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm(taskId);
                onClose();
              }}
              className="px-5 py-2 rounded-lg font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20 transition-all"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
