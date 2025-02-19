import { z } from 'zod';
export declare const ProductoSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    nombre: z.ZodString;
    descripcion: z.ZodOptional<z.ZodString>;
    precio: z.ZodNumber;
    stock: z.ZodNumber;
    categoria: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    nombre: string;
    precio: number;
    stock: number;
    id?: number | undefined;
    descripcion?: string | undefined;
    categoria?: string | undefined;
    created_at?: Date | undefined;
}, {
    nombre: string;
    precio: number;
    stock: number;
    id?: number | undefined;
    descripcion?: string | undefined;
    categoria?: string | undefined;
    created_at?: Date | undefined;
}>;
export type Producto = z.infer<typeof ProductoSchema>;
