"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericRoutes = void 0;
const express_1 = require("express");
const generic_controller_1 = require("../controllers/generic.controller");
exports.genericRoutes = (0, express_1.Router)();
const controllers = {
    productos: new generic_controller_1.GenericController('productos')
};
exports.genericRoutes.post('/:tabla', async (req, res) => {
    const { tabla } = req.params;
    const { action, data } = req.body;
    try {
        const controller = controllers[tabla];
        if (!controller) {
            return res.status(404).json({ error: `Tabla ${tabla} no encontrada` });
        }
        const result = await controller.create(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
});
exports.genericRoutes.get('/:tabla', async (req, res) => {
    const { tabla } = req.params;
    try {
        const controller = controllers[tabla];
        if (!controller) {
            return res.status(404).json({ error: `Tabla ${tabla} no encontrada` });
        }
        const result = await controller.getAll();
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error desconocido' });
    }
});
