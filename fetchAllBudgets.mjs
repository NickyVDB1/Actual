// fetchAllBudget.mjs
import dotenv from 'dotenv';
import { performance } from 'perf_hooks';
import { initializeAPI, shutdownAPI } from './apiUtils.mjs';
import actualAPI from '@actual-app/api';

dotenv.config();

async function fetchBudgetMonth(month) {
  try {
    await initializeAPI();

    const budgetId = process.env.BUDGET_ID;
    const encryptionPassword = process.env.ENCRYPTION_PASSWORD;

    if (!budgetId) {
      throw new Error('BUDGET_ID is not defined in environment variables');
    }

    if (encryptionPassword) {
      await actualAPI.downloadBudget(budgetId, { password: encryptionPassword });
    } else {
      await actualAPI.downloadBudget(budgetId);
    }

    let budget = await actualAPI.getBudgetMonth(month);
    await shutdownAPI();

    return { month, budget };
  } catch (error) {
    console.error(`Error fetching budget data for ${month}:`, error);
    return { month, error: error.message };
  }
}

export default async function fetchAllBudgetData() {
  const startTime = performance.now();
  try {
    await initializeAPI();

    // Fetch the list of budget months
    const budgetMonths = await actualAPI.getBudgetMonths();
    
    if (!budgetMonths || budgetMonths.length === 0) {
      throw new Error('No budget months found.');
    }

    // Perform parallel fetches for each month
    const promises = budgetMonths.map(month => fetchBudgetMonth(month));
    const allBudgets = await Promise.all(promises);

    await shutdownAPI();

    const endTime = performance.now();
    console.log(`Fetching all budget data took ${endTime - startTime} milliseconds`);

    return allBudgets;
  } catch (error) {
    console.error('Error fetching all budget data:', error);
    throw new Error('Error fetching all budget data: ' + error.message);
  }
}
