import express, { type Request, type Response, type NextFunction, type Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export function createApp(prefix: string, router: Router): express.Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    })
  );
  app.use(express.json());

  // ETags disabled: the proxy always returns a fresh body; ETags would cause
  // the browser to receive 304 with no body on subsequent requests.
  app.set('etag', false);

  app.use(prefix, router);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[cookplan api error]', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
}
