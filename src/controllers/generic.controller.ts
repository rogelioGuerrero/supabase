import { Request, Response } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Tipo genérico para modelos
export interface GenericModel {
  id?: number | string;
  [key: string]: any;
}

export class GenericController<T extends GenericModel> {
  private supabase: SupabaseClient;
  private tableName: string;

  constructor(tableName: string) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!, 
      process.env.SUPABASE_KEY!
    );
    this.tableName = tableName;
  }

  // Método genérico para manejar todas las operaciones
  async handleAction(req: Request, res: Response) {
    const { action, data, id } = req.body;

    try {
      switch(action) {
        case 'create':
          return await this.create(req, res);
        case 'update':
          return await this.update(req, res);
        case 'delete':
          return await this.delete(req, res);
        case 'list':
          return await this.list(req, res);
        case 'get':
          return await this.getById(req, res);
        default:
          return res.status(400).json({ 
            error: 'Acción no válida', 
            availableActions: ['create', 'update', 'delete', 'list', 'get'] 
          });
      }
    } catch (error) {
      console.error(`Error en ${this.tableName}:`, error);
      return res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      });
    }
  }

  // Crear un nuevo registro
  private async create(req: Request, res: Response) {
    try {
      const { data } = req.body;

      // Validación básica
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ 
          error: 'Datos inválidos', 
          message: 'Se requiere un objeto de datos válido' 
        });
      }

      // Inserción directa sin select
      const { error } = await this.supabase
        .from(this.tableName)
        .insert(data);

      if (error) {
        console.error(`Error de Supabase al insertar en ${this.tableName}:`, error);
        return res.status(400).json({ 
          error: 'Error al crear registro', 
          details: error.message 
        });
      }

      return res.status(201).json({ 
        message: 'Registro creado exitosamente', 
        data: data 
      });
    } catch (error) {
      console.error('Error inesperado:', error);
      return res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      });
    }
  }

  // Actualizar un registro existente
  private async update(req: Request, res: Response) {
    const { id, data } = req.body;

    const { data: updatedRecord, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select();

    if (error) {
      return res.status(400).json({ 
        error: 'Error al actualizar registro', 
        details: error.message 
      });
    }

    return res.status(200).json(updatedRecord);
  }

  // Eliminar un registro
  private async delete(req: Request, res: Response) {
    const { id } = req.body;

    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ 
        error: 'Error al eliminar registro', 
        details: error.message 
      });
    }

    return res.status(200).json({ 
      message: 'Registro eliminado exitosamente' 
    });
  }

  // Listar registros
  private async list(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit) - 1;

    const { data: records, error, count } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .range(start, end);

    if (error) {
      return res.status(400).json({ 
        error: 'Error al listar registros', 
        details: error.message 
      });
    }

    return res.status(200).json({
      records,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0
      }
    });
  }

  // Obtener registro por ID
  private async getById(req: Request, res: Response) {
    const { id } = req.body;

    const { data: record, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ 
        error: 'Registro no encontrado', 
        details: error.message 
      });
    }

    return res.status(200).json(record);
  }
}
