"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Función para cargar variables de entorno de manera más robusta
function loadEnvFile() {
    const envPath = path.resolve(process.cwd(), '.env');
    const exampleEnvPath = path.resolve(process.cwd(), '.env.example');
    // Primero, cargar .env
    if (fs.existsSync(envPath)) {
        console.log('Cargando variables de .env');
        dotenv.config({ path: envPath });
    }
    // Si no existe .env, cargar .env.example
    else if (fs.existsSync(exampleEnvPath)) {
        console.log('Cargando variables de .env.example');
        dotenv.config({ path: exampleEnvPath });
    }
    else {
        console.warn('No se encontró ningún archivo .env o .env.example');
    }
}
// Cargar variables de entorno
loadEnvFile();
// Validar variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
console.log('Configuración de Supabase:');
console.log('URL:', supabaseUrl);
console.log('Longitud de Clave:', supabaseKey?.length || 'No definida');
console.log('Variables de entorno:', process.env);
// Valores de ejemplo para desarrollo
const DEFAULT_SUPABASE_URL = 'https://xakndhgpnwcgbaeovuhw.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhha25kaGdwbndjZ2JhZW92dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyODE4MDIsImV4cCI6MjA1NDg1NzgwMn0.Rb76WIq8Z7wkR5xMgh2o7ZeaNMwoKAJ5pgaEPEAyIS8';
// Usar valores de ejemplo si no están definidos
const finalSupabaseUrl = supabaseUrl || DEFAULT_SUPABASE_URL;
const finalSupabaseKey = supabaseKey || DEFAULT_SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.warn('ADVERTENCIA: Usando valores de ejemplo para Supabase');
}
// Crear cliente de Supabase
const supabase = (0, supabase_js_1.createClient)(finalSupabaseUrl, finalSupabaseKey, {
    auth: {
        persistSession: false
    },
    global: {
        headers: {
            'x-my-custom-header': 'backend-api-supabase'
        }
    }
});
console.log('Cliente de Supabase creado exitosamente');
exports.default = supabase;
