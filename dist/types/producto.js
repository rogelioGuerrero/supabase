"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoSchema = void 0;
const zod_1 = require("zod");
exports.ProductoSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    nombre: zod_1.z.string().min(1, "Nombre es requerido"),
    descripcion: zod_1.z.string().optional(),
    precio: zod_1.z.number().positive("Precio debe ser positivo"),
    stock: zod_1.z.number().int().nonnegative("Stock no puede ser negativo"),
    categoria: zod_1.z.string().optional(),
    created_at: zod_1.z.date().optional()
});
