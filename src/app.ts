import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { genericRoutes } from './routes/generic.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/generic', genericRoutes);

// Serverless export
export const handler = serverless(app);

// Local server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

export default app;
