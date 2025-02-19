"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericController = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error('Configuración de Supabase incompleta:', { supabaseUrl, supabaseKey });
    throw new Error('SUPABASE_URL y SUPABASE_KEY son requeridos en .env');
}
class GenericController {
    supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    tableName;
    constructor(tableName) {
        this.tableName = tableName;
    }
    async create(data) {
        const { data: result, error } = await this.supabase
            .from(this.tableName)
            .insert(data)
            .select();
        if (error)
            throw error;
        return result;
    }
    async getAll() {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select('*');
        if (error)
            throw error;
        return data;
    }
}
exports.GenericController = GenericController;
