import express from 'express';

const app = express();

// Use dynamic import for fetchBudgetData
app.get('/budget', async (req, res) => {
  try {
    const { default: fetchBudgetData } = await import('./fetchBudget.mjs');
    let budget = await fetchBudgetData();
    res.json(budget);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Use dynamic import for fetchBudgetForAllMonths
app.get('/budget/all', async (req, res) => {
  try {
    const { default: fetchBudgetForAllMonths } = await import('./fetchAllBudgets.mjs');
    let allBudgets = await fetchBudgetForAllMonths();
    res.json(allBudgets); // Return the accumulated results as JSON
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
