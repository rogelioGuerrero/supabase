"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_1 = __importDefault(require("./config/supabase"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const producto_routes_1 = __importDefault(require("./routes/producto.routes"));
const generic_routes_1 = __importDefault(require("./routes/generic.routes"));
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Configuración de CORS
const corsOptions = {
    origin: '*', // Configura esto según tus necesidades de seguridad
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key']
};
// Middlewares
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Rutas de salud y conexión
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});
app.get('/test-connection', async (req, res) => {
    try {
        console.log('Intentando conexión a Supabase...');
        console.log('Configuración de entorno:', {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKeyLength: process.env.SUPABASE_KEY?.length || 'No definida'
        });
        // Intentar listar tablas
        const { data: tables, error: tablesError } = await supabase_1.default.rpc('list_tables');
        console.log('Resultado de list_tables:', { tables, tablesError });
        if (tablesError) {
            console.error('Error listando tablas:', tablesError);
            // Si falla listar tablas, intentar consulta a productos
            const { data, error } = await supabase_1.default
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
    }
    catch (err) {
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
app.use('/generic', generic_routes_1.default);
// Rutas de productos
app.use('/productos', auth_middleware_1.apiKeyMiddleware, producto_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Ruta no encontrada'
    });
});
// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Exportar para Netlify Functions
const handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'API lista para Netlify' })
    };
};
exports.handler = handler;
// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
exports.default = app;
