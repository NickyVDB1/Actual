import express from 'express';
import fetchBudgetData from './fetchBudget.mjs';

const app = express();

app.get('/budget', async (req, res) => {
  try {
    let budget = await fetchBudgetData();
    res.json(budget);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
