import express, { Request, Response, NextFunction } from 'express';
import type { CorsOptions } from 'cors';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './config/supabase';
import { apiKeyMiddleware } from './middlewares/auth.middleware';
import productosRoutes from './routes/producto.routes';
import genericRoutes from './routes/generic.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions: CorsOptions = {
  origin: '*', // Configura esto según tus necesidades de seguridad
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas de salud y conexión
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

app.get('/test-connection', async (req: Request, res: Response) => {
  try {
    console.log('Intentando conexión a Supabase...');
    console.log('Configuración de entorno:', {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKeyLength: process.env.SUPABASE_KEY?.length || 'No definida'
    });

    // Intentar listar tablas
    const { data: tables, error: tablesError } = await supabase.rpc('list_tables');

    console.log('Resultado de list_tables:', { tables, tablesError });

    if (tablesError) {
      console.error('Error listando tablas:', tablesError);
      
      // Si falla listar tablas, intentar consulta a productos
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .limit(1);

      console.log('Resultado de consulta a productos:', { data, error });

      if (error) {
        console.error('Error en consulta a productos:', error);
        return res.status(500).json({ 
          connection: 'partial', 
          error: {
            message: error.message,
            details: error
          }
        });
      }

      return res.json({ 
        connection: 'successful', 
        message: 'Conexión parcial establecida',
        sampleData: data 
      });
    }

    // Si se listan tablas exitosamente
    res.json({ 
      connection: 'successful', 
      message: 'Conexión completa establecida',
      tables: tables 
    });
  } catch (err) {
    console.error('Excepción en test-connection:', err);
    res.status(500).json({ 
      connection: 'failed', 
      error: err instanceof Error ? {
        message: err.message,
        name: err.name,
        stack: err.stack
      } : String(err)
    });
  }
});

// Rutas genéricas
app.use('/generic', genericRoutes);

// Rutas de productos
app.use('/productos', apiKeyMiddleware, productosRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada' 
  });
});

// Middleware de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Exportar para Netlify Functions
export const handler = async (event: any, context: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'API lista para Netlify' })
  };
};

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;
