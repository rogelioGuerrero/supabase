"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericController = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class GenericController {
    constructor(tableName) {
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        this.tableName = tableName;
    }
    // Método genérico para manejar todas las operaciones
    async handleAction(req, res) {
        const { action, data, id } = req.body;
        try {
            switch (action) {
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
        }
        catch (error) {
            console.error(`Error en ${this.tableName}:`, error);
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    // Crear un nuevo registro
    async create(req, res) {
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
        }
        catch (error) {
            console.error('Error inesperado:', error);
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    // Actualizar un registro existente
    async update(req, res) {
        try {
            const { id, data } = req.body;
            // Validación básica
            if (!id) {
                return res.status(400).json({
                    error: 'Datos inválidos',
                    message: 'Se requiere un ID para actualizar'
                });
            }
            if (!data || typeof data !== 'object') {
                return res.status(400).json({
                    error: 'Datos inválidos',
                    message: 'Se requiere un objeto de datos válido'
                });
            }
            // Actualización directa
            const { error } = await this.supabase
                .from(this.tableName)
                .update(data)
                .eq('id', id);
            if (error) {
                console.error(`Error de Supabase al actualizar en ${this.tableName}:`, error);
                return res.status(400).json({
                    error: 'Error al actualizar registro',
                    details: error.message
                });
            }
            return res.status(200).json({
                message: 'Registro actualizado exitosamente',
                id: id,
                data: data
            });
        }
        catch (error) {
            console.error('Error inesperado:', error);
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    // Eliminar un registro
    async delete(req, res) {
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
    async list(req, res) {
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
    async getById(req, res) {
        try {
            const { id } = req.body;
            // Validar que se proporcione un ID
            if (!id) {
                return res.status(400).json({
                    error: 'Datos inválidos',
                    message: 'Se requiere un ID para obtener el registro'
                });
            }
            // Consulta con manejo específico para un solo registro
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single(); // Asegura que solo se devuelva un registro
            if (error) {
                console.error(`Error al obtener registro en ${this.tableName}:`, error);
                // Manejar diferentes tipos de errores
                if (error.code === 'PGRST116') {
                    return res.status(404).json({
                        error: 'Registro no encontrado',
                        details: `No existe un registro con ID ${id} en la tabla ${this.tableName}`
                    });
                }
                return res.status(400).json({
                    error: 'Error al obtener registro',
                    details: error.message
                });
            }
            // Verificar si se encontró un registro
            if (!data) {
                return res.status(404).json({
                    error: 'Registro no encontrado',
                    details: `No existe un registro con ID ${id} en la tabla ${this.tableName}`
                });
            }
            return res.status(200).json(data);
        }
        catch (error) {
            console.error('Error inesperado:', error);
            return res.status(500).json({
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}
exports.GenericController = GenericController;
