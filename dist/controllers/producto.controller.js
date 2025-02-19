"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducto = exports.updateProducto = exports.getProductoById = exports.getProductos = exports.createProducto = void 0;
const supabase_1 = __importDefault(require("../config/supabase"));
const producto_1 = require("../types/producto");
const zod_1 = require("zod");
const createProducto = async (req, res) => {
    try {
        const validatedData = producto_1.ProductoSchema.omit({ id: true, created_at: true }).parse(req.body);
        const { data, error } = await supabase_1.default
            .from('productos')
            .insert(validatedData)
            .select();
        if (error)
            throw error;
        res.status(201).json(data[0]);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: "Validation Error",
                errors: error.errors
            });
        }
        res.status(500).json({
            message: "Error creating producto",
            error: error.message
        });
    }
};
exports.createProducto = createProducto;
const getProductos = async (req, res) => {
    try {
        const { data, error } = await supabase_1.default
            .from('productos')
            .select('*');
        if (error)
            throw error;
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching productos",
            error: error.message
        });
    }
};
exports.getProductos = getProductos;
const getProductoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { data, error } = await supabase_1.default
            .from('productos')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: "Producto not found" });
        }
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching producto",
            error: error.message
        });
    }
};
exports.getProductoById = getProductoById;
const updateProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const validatedData = producto_1.ProductoSchema.omit({ id: true, created_at: true }).parse(req.body);
        const { data, error } = await supabase_1.default
            .from('productos')
            .update(validatedData)
            .eq('id', id)
            .select();
        if (error)
            throw error;
        if (data.length === 0) {
            return res.status(404).json({ message: "Producto not found" });
        }
        res.status(200).json(data[0]);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                message: "Validation Error",
                errors: error.errors
            });
        }
        res.status(500).json({
            message: "Error updating producto",
            error: error.message
        });
    }
};
exports.updateProducto = updateProducto;
const deleteProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { data, error } = await supabase_1.default
            .from('productos')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        if (data === null) {
            return res.status(404).json({ message: "Producto not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting producto",
            error: error.message
        });
    }
};
exports.deleteProducto = deleteProducto;
