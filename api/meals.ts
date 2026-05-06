import { createApp } from './_create-app.js';
import { mealRouter } from './_meal-routes.js';

const app = createApp('/api/meals', mealRouter);
export default app;

if (!process.env['VERCEL']) {
  const port = process.env['PORT'] ?? 3003;
  app.listen(port, () => console.log(`Meals API listening on port ${port}`));
}
