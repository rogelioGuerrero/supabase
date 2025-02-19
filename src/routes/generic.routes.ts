import { Router, Request, Response } from 'express';
import { GenericController } from '../controllers/generic.controller';
import { apiKeyMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Mapeo de controladores para diferentes tablas
const controllerMap: { [key: string]: GenericController<any> } = {
  'productos': new GenericController('productos'),
  // Añadir más tablas aquí
};

// Ruta genérica para todas las operaciones
router.post('/:tabla', 
  apiKeyMiddleware,  // Mantener middleware de API key
  async (req: Request, res: Response) => {
    const { tabla } = req.params;
    
    const controller = controllerMap[tabla];
    
    if (!controller) {
      return res.status(404).json({ 
        error: 'Tabla no encontrada', 
        availableTables: Object.keys(controllerMap) 
      });
    }

    return controller.handleAction(req, res);
});

export default router;
