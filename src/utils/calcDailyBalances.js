import { parseISO, format, eachDayOfInterval } from "date-fns";
import { parse } from "date-fns";

/**
 * Computes daily cumulative balances for a date range.
 * - Groups transactions by exact date ('yyyy-MM-dd') to get daily net deltas.
 * - Iterates days in order, accumulating: balance = prevBalance + dayDelta (0 if no tx).
 * - Handles startingBalance (default 0), multiple tx per day, and empty days (carry-forward).
 * @param {Array} transactions - Array of tx objects { date: 'yyyy-MM-dd', type: 'income'|'expense', amount: number }
 * @param {Object} options - { start: Date, end: Date, startingBalance: number = 0 }
 * @returns {Object} dailyBalances - { 'yyyy-MM-dd': number } map of cumulative balance per day
 */
export function computeDailyBalances(
  transactions,
  { start, end, startingBalance = 0 }
) {
  // Step 1: Group and sum deltas by exact date string (yyyy-MM-dd)
  const groupedTx = transactions.reduce((acc, tx) => {
    const txDate = parse(tx.date, "yyyy-MM-dd", new Date()); // parse local date
    const dateStr = format(txDate, "yyyy-MM-dd"); // Normalize to local date string
    const delta = tx.type === "income" ? tx.amount : -tx.amount;
    acc[dateStr] = (acc[dateStr] || 0) + delta;
    return acc;
  }, {});

  // Step 2: Generate ordered days from start to end inclusive
  const days = eachDayOfInterval({ start, end });

  // Step 3: Accumulate balances day by day
  let prevBalance = startingBalance;
  const dailyBalances = {};
  days.forEach((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayDelta = groupedTx[dayStr] || 0; // 0 for no transactions (carry forward)
    const dayBalance = prevBalance + dayDelta;
    dailyBalances[dayStr] = dayBalance;
    prevBalance = dayBalance; // Update for next day
  });

  return dailyBalances;
}
