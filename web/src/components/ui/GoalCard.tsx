import { Pencil, Trash2, Plus, Target, Plane, Home, Car, Laptop, Heart } from 'lucide-react';
import type { SavingsGoal } from '../../types';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface Props {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
  onFund: (goal: SavingsGoal) => void;
}

export const ICONS: Record<string, React.FC<any>> = {
  Target,
  Plane,
  Home,
  Car,
  Laptop,
  Heart,
};

export const COLORS: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
};

export function GoalCard({ goal, onEdit, onDelete, onFund }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const Icon = ICONS[goal.icon] || Target;
  const colorClass = COLORS[goal.color] || 'bg-primary-500';
  const progress = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col group transition-all hover:shadow-md relative overflow-hidden">
        {/* Decorative background circle */}
        <div
          className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${colorClass}`}
        />

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl text-white ${colorClass} shadow-sm`}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{goal.name}</h3>
              {goal.deadline && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target by {new Date(goal.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              className="p-2 text-slate-400 hover:text-primary-500 transition-colors"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="mt-2 mb-6">
          <div className="flex justify-between items-end mb-2">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              ${goal.currentAmount.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              of ${goal.targetAmount.toLocaleString()}
            </div>
          </div>

          <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {progress.toFixed(1)}% Completed
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              ${(goal.targetAmount - goal.currentAmount).toLocaleString()} left
            </span>
          </div>
        </div>

        <button
          onClick={() => onFund(goal)}
          className={`mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700`}
        >
          <Plus size={18} /> Add Funds
        </button>
      </div>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Delete Goal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the "{goal.name}" goal? This will not affect your main
            transaction history.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onDelete(goal.id);
              setConfirmDelete(false);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
