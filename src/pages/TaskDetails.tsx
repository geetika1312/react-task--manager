import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { ArrowLeft, Save, Hash , CheckCircle2, Calendar } from 'lucide-react';
import { StatusSelect, PrioritySelect, DateSelect } from '../components/InlineSelect';
import { isBefore, startOfDay } from 'date-fns';

export function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask } = useTasks();

  const task = tasks.find(t => t.id === Number(id));

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task?.id]);

  if (!task) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold text-foreground">Task not found</h2>
        <p className="text-muted-foreground text-sm">This task may have been deleted or doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isOverdue =
    !!task.dueDate &&
    isBefore(startOfDay(new Date(task.dueDate)), startOfDay(new Date())) &&
    task.status !== 'completed';

  const handleSave = async () => {
    setIsSaving(true);
    await updateTask(task.id, {
      title: title.trim() || task.title,
      description,
    });
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 sm:px-10 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10">
        {/* Task ID + Status */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded border border-border/30">
            TASK-{task.id}
          </span>
          <StatusSelect
            status={task.status}
            onChange={(s) => updateTask(task.id, { status: s, completed: s === 'completed' })}
          />
          {task.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={() => { if (title.trim() && title !== task.title) handleSave(); }}
          className="w-full bg-transparent text-3xl font-bold text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg -ml-1 px-1 py-1 mb-8"
          placeholder="Task Title"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Description */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-sm font-semibold text-foreground">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="w-full min-h-[280px] bg-card border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-y text-sm leading-relaxed"
            />
          </div>

          {/* Right: Properties */}
          <div>
            <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-2">
                Properties
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Due Date
                </label>
                <div className="bg-background border border-border rounded-lg px-3 py-2">
                  <DateSelect
                    date={task.dueDate}
                    onChange={(d) => updateTask(task.id, { dueDate: d })}
                    isOverdue={isOverdue}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5" /> Priority
                </label>
                <div className="bg-background border border-border rounded-lg px-3 py-2">
                  <PrioritySelect
                    priority={task.priority}
                    onChange={(p) => updateTask(task.id, { priority: p ?? undefined })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Status
                </label>
                <div className="bg-background border border-border rounded-lg px-3 py-2">
                  <StatusSelect
                    status={task.status}
                    onChange={(s) => updateTask(task.id, { status: s, completed: s === 'completed' })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
