import { createApp } from './_create-app.js';
import { personRouter } from './_person-routes.js';

const app = createApp('/api/persons', personRouter);
const port = process.env['PORT'] ?? 3002;
app.listen(port, () => console.log(`Persons API listening on port ${port}`));
