import express from 'express';
import apiKeyMiddleware from './apiKeyMiddleware.js'; // Adjust the path as needed

const app = express();

// Apply middleware to routes that require API key authorization
app.use('/budget', apiKeyMiddleware);
app.use('/budget/all', apiKeyMiddleware);
app.use('/RunBanksync', apiKeyMiddleware);

app.get('/budget', async (req, res) => {
  try {
    const { default: fetchBudgetData } = await import('./fetchBudget.mjs');
    let budget = await fetchBudgetData();
    res.json(budget);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get('/budget/all', async (req, res) => {
  try {
    const { default: fetchBudgetForAllMonths } = await import('./fetchAllBudgets.mjs');
    let allBudgets = await fetchBudgetForAllMonths();
    res.json(allBudgets); // Return the accumulated results as JSON
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.get('/RunBanksync', async (req, res) => {
  try {
    const { default: runBankSync } = await import('./Banksync.mjs');

    await runBankSync();  // Call the function

    res.status(200).json({ message: 'Bank sync completed successfully' });
  } catch (error) {
    console.error('Error during bank sync:', error);
    res.status(500).json({ error: 'Failed to run bank sync' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
