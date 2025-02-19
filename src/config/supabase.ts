import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

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
  } else {
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
const supabase: SupabaseClient = createClient(finalSupabaseUrl, finalSupabaseKey, {
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

export default supabase;
