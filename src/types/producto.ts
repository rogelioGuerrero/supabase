import { z } from 'zod';

export const ProductoSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(1, "Nombre es requerido"),
  descripcion: z.string().optional(),
  precio: z.number().positive("Precio debe ser positivo"),
  stock: z.number().int().nonnegative("Stock no puede ser negativo"),
  categoria: z.string().optional(),
  created_at: z.date().optional()
});

export type Producto = z.infer<typeof ProductoSchema>;
