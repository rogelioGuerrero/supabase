import { Router } from 'express';
import { GenericController } from '../controllers/generic.controller';

export const genericRoutes = Router();

const controllers: { [key: string]: GenericController } = {
  productos: new GenericController('productos')
};

genericRoutes.post('/:tabla', async (req, res) => {
  const { tabla } = req.params;
  const { action, data } = req.body;

  try {
    const controller = controllers[tabla];
    if (!controller) {
      return res.status(404).json({ error: `Tabla ${tabla} no encontrada` });
    }

    const result = await controller.create(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
});

genericRoutes.get('/:tabla', async (req, res) => {
  const { tabla } = req.params;

  try {
    const controller = controllers[tabla];
    if (!controller) {
      return res.status(404).json({ error: `Tabla ${tabla} no encontrada` });
    }

    const result = await controller.getAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
  }
});
