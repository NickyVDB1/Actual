import fetch from 'node-fetch';
import dotenv from 'dotenv';
import express from 'express';
import actualAPI from '@actual-app/api';
import { performance } from 'perf_hooks';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get('/budget', async (req, res) => {
  const startTime = performance.now();
  try {
    await actualAPI.init({
      dataDir: 'C:\\Users\\vanden2\\OneDrive\\Documenten\\Hobbies\\Actualbudget\\budgetdata',
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

    res.json(budget);
  } catch (error) {
    console.error('Error fetching budget data:', error);
    res.status(500).send('Error fetching budget data: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});