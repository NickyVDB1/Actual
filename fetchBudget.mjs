import fetch from 'node-fetch';
import dotenv from 'dotenv';
import actualAPI from '@actual-app/api';
import { performance } from 'perf_hooks';

dotenv.config();

export default async function fetchBudgetData() {
  const startTime = performance.now();
  try {
    await actualAPI.init({
      dataDir: process.env.DATA_DIR, // Use environment variable for path
      serverURL: process.env.SERVER_URL,
      password: process.env.PASSWORD,
    });

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
    await actualAPI.shutdown();

    const endTime = performance.now();
    console.log(`Budget fetching took ${endTime - startTime} milliseconds`);

    return budget;
  } catch (error) {
    console.error('Error fetching budget data:', error);
    throw new Error('Error fetching budget data: ' + error.message);
  }
}
