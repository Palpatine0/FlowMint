import { Target, Plus } from 'lucide-react';
import type { SavingsGoal } from '../types';
import { GoalCard } from '../components/ui/GoalCard';

interface Props {
  goals: SavingsGoal[];
  onAdd: () => void;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
  onFund: (goal: SavingsGoal) => void;
}

export function Goals({ goals, onAdd, onEdit, onDelete, onFund }: Props) {
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Target className="text-primary-500" size={28} />
            Savings Goals
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            You've saved ${totalSaved.toLocaleString()} towards your ${totalTarget.toLocaleString()}{' '}
            goal targets!
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors shadow-sm shadow-primary-500/20"
        >
          <Plus size={20} /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onEdit={onEdit} onDelete={onDelete} onFund={onFund} />
        ))}

        {goals.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <Target size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
              No Savings Goals Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Create your first savings goal to start tracking progress towards your dream purchase
              or milestone.
            </p>
            <button
              onClick={onAdd}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-primary-500 text-primary-500 rounded-xl font-semibold transition-colors shadow-sm"
            >
              <Plus size={20} /> Create Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
