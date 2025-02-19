"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const API_KEY = process.env.API_KEY || 'test_api_key_2024';
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ error: 'API key inválida' });
    }
    next();
};
exports.authMiddleware = authMiddleware;
