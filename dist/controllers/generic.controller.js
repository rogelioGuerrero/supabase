"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericController = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
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
