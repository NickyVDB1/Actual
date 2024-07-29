// Banksync.mjs
import dotenv from 'dotenv';
import { initializeAPI, shutdownAPI } from './apiUtils.mjs';
import actualAPI from '@actual-app/api';

dotenv.config();

export default async function runBankSync() {
  try {
    await initializeAPI();

    const budgetId = process.env.BUDGET_ID;
    const encryptionPassword = process.env.ENCRYPTION_PASSWORD;

    // Uncomment and handle budget download logic if needed
   
    if (!budgetId) {
      throw new Error('BUDGET_ID is not defined in environment variables');
    }

    if (encryptionPassword) {
      await actualAPI.downloadBudget(budgetId, { password: encryptionPassword });
    } else {
      await actualAPI.downloadBudget(budgetId);
    }
    

    await actualAPI.runBankSync("d8877ddf-8e9b-427a-a795-e387185b57ae");

    await shutdownAPI();
  } catch (error) {
    console.error('Error fetching all budget data:', error);
    throw new Error('Error fetching all budget data: ' + error.message);
  }
}
