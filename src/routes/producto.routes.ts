import { Router } from 'express';
import * as ProductoController from '../controllers/producto.controller';
import { apiKeyMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Apply API key middleware to all routes
router.use(apiKeyMiddleware);

// CRUD Routes for Productos
router.post('/', ProductoController.createProducto);
router.get('/', ProductoController.getProductos);
router.get('/:id', ProductoController.getProductoById);
router.put('/:id', ProductoController.updateProducto);
router.delete('/:id', ProductoController.deleteProducto);

export default router;
