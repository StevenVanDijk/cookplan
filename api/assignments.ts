import { createApp } from './_create-app.js';
import { assignmentRouter } from './_assignment-routes.js';

const app = createApp('/api/assignments', assignmentRouter);
export default app;

if (!process.env['VERCEL']) {
  const port = process.env['PORT'] ?? 3001;
  app.listen(port, () => console.log(`Assignments API listening on port ${port}`));
}
