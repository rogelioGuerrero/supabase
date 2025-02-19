import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import supabase from './config/supabase';
import productosRoutes from './routes/producto.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/productos', productosRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Test Supabase connection route
app.get('/test-connection', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .limit(1);

    if (error) throw error;

    res.status(200).json({ 
      connection: 'successful', 
      sampleData: data 
    });
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to connect to Supabase' 
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Endpoint not found' 
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
