import dotenv from 'dotenv';
import { performance } from 'perf_hooks';
import { initializeAPI, shutdownAPI } from './apiUtils.mjs';
import actualAPI from '@actual-app/api';

dotenv.config();

export default async function fetchBudgetData() {
  const startTime = performance.now();
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

    let budget = await actualAPI.getBudgetMonth('2024-07');
    await shutdownAPI();

    const endTime = performance.now();
    console.log(`Budget fetching took ${endTime - startTime} milliseconds`);

    return budget;
  } catch (error) {
    console.error('Error fetching budget data:', error);
    throw new Error('Error fetching budget data: ' + error.message);
  }
}
