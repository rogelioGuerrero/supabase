"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generic_controller_1 = require("../controllers/generic.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Mapeo de controladores para diferentes tablas
const controllerMap = {
    'productos': new generic_controller_1.GenericController('productos'),
    // Añadir más tablas aquí
};
// Ruta genérica para todas las operaciones
router.post('/:tabla', auth_middleware_1.apiKeyMiddleware, // Mantener middleware de API key
async (req, res) => {
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
exports.default = router;
