import type { SavingsGoal } from '../types';

const STORAGE_KEY = 'flowmint_goals';

export const getSavingsGoals = async (): Promise<SavingsGoal[]> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load savings goals:', error);
    return [];
  }
};

export const saveSavingsGoals = (goals: SavingsGoal[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save savings goals:', error);
  }
};
