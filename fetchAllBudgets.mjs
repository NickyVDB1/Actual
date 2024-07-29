import dotenv from 'dotenv';
import { initializeAPI, shutdownAPI } from './apiUtils.mjs';
import actualAPI from '@actual-app/api';

dotenv.config();

export default async function fetchAllBudgetData() {
  try {
    await initializeAPI();

    const budgetId = process.env.BUDGET_ID;
    const encryptionPassword = process.env.ENCRYPTION_PASSWORD;

    if (!budgetId) {
      throw new Error('BUDGET_ID is not defined in environment variables');
    }

    // Download the budget once
    if (encryptionPassword) {
      await actualAPI.downloadBudget(budgetId, { password: encryptionPassword });
    } else {
      await actualAPI.downloadBudget(budgetId);
    }

    // Fetch the list of budget months
    const budgetMonths = await actualAPI.getBudgetMonths();
    const allBudgets = [];

    // Define the getBudgetMonth function
    async function getBudgetMonth(month) {
      return await actualAPI.getBudgetMonth(month);
    }

    // Loop through each month and fetch the budget
    for (const month of budgetMonths) {
      try {
        const budgetMonth = await getBudgetMonth(month);
        allBudgets.push(budgetMonth);
      } catch (error) {
        console.error(`Error fetching budget for month ${month}:`, error);
      }
    }

    await shutdownAPI();

    return allBudgets;
  } catch (error) {
    console.error('Error fetching all budget data:', error);
    throw new Error('Error fetching all budget data: ' + error.message);
  }
}
