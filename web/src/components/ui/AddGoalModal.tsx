import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { SavingsGoal } from '../../types';
import { ICONS, COLORS } from './GoalCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: SavingsGoal) => void;
  editGoal?: SavingsGoal;
}

export function AddGoalModal({ isOpen, onClose, onSave, editGoal }: Props) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Target');
  const [selectedColor, setSelectedColor] = useState('emerald');

  useEffect(() => {
    if (isOpen) {
      if (editGoal) {
        setName(editGoal.name);
        setTargetAmount(editGoal.targetAmount.toString());
        setDeadline(editGoal.deadline ? editGoal.deadline.split('T')[0] : '');
        setSelectedIcon(editGoal.icon);
        setSelectedColor(editGoal.color);
      } else {
        setName('');
        setTargetAmount('');
        setDeadline('');
        setSelectedIcon('Target');
        setSelectedColor('emerald');
      }
    }
  }, [isOpen, editGoal]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    const goal: SavingsGoal = {
      id: editGoal ? editGoal.id : crypto.randomUUID(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: editGoal ? editGoal.currentAmount : 0,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      color: selectedColor,
      icon: selectedIcon,
    };

    onSave(goal);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {editGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Goal Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-100"
              placeholder="e.g. Vacation Fund"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Target Amount
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-slate-100"
                placeholder="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Deadline (Optional)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-500 dark:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Icon
            </label>
            <div className="flex gap-2 mb-4">
              {Object.keys(ICONS).map((iconName) => {
                const IconComp = ICONS[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedIcon === iconName
                        ? 'border-primary-500 bg-primary-50 text-primary-500 dark:bg-primary-900/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <IconComp size={20} />
                  </button>
                );
              })}
            </div>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 mt-4">
              Color
            </label>
            <div className="flex gap-3">
              {Object.keys(COLORS).map((colorName) => (
                <button
                  key={colorName}
                  type="button"
                  onClick={() => setSelectedColor(colorName)}
                  className={`w-8 h-8 rounded-full ${COLORS[colorName]} shadow-sm transform transition-transform ${
                    selectedColor === colorName
                      ? 'scale-125 ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-slate-800'
                      : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors shadow-sm shadow-primary-500/20"
            >
              Save Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
