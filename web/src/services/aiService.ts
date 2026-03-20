import type { Transaction, SavingsGoal } from '../types';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const generateAIResponse = async (
  prompt: string,
  apiKey: string,
  transactions: Transaction[],
  goals: SavingsGoal[],
): Promise<string> => {
  if (!apiKey) throw new Error('API Key is missing. Please add it in your settings.');

  const recentTx = transactions
    .slice(0, 50)
    .map(
      (t) =>
        `[${t.date}] ${t.description} (${t.category}): ${t.type === 'income' ? '+' : '-'}$${t.amount}`,
    )
    .join('\n');

  const goalsContext = goals
    .map((g) => `${g.name}: $${g.currentAmount} / $${g.targetAmount}`)
    .join('\n');

  const systemContext = `
You are FlowMint, an expert personal finance AI assistant specifically designed for this application.
Your goal is to answer the user's questions about their finances based exclusively on the given local data.
Keep your answers very concise, friendly, and use strong markdown formatting (bold words, bullet lists, emojis) to make it easy to glance at. Do not give generic advice if specific data is available.

--- RECENT TRANSACTIONS (Max 50) ---
${recentTx || 'No recent transactions found.'}

--- SAVINGS GOALS ---
${goalsContext || 'No active savings goals found.'}
  `;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: systemContext + '\n\nUser Question: ' + prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
    },
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to fetch AI response');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
