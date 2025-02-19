import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Configuración de Supabase incompleta:', { supabaseUrl, supabaseKey });
  throw new Error('SUPABASE_URL y SUPABASE_KEY son requeridos en .env');
}

export class GenericController {
  private supabase = createClient(supabaseUrl, supabaseKey);
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async create(data: any) {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select();

    if (error) throw error;
    return result;
  }

  async getAll() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*');

    if (error) throw error;
    return data;
  }
}
