"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const generic_routes_1 = require("./routes/generic.routes");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(auth_middleware_1.authMiddleware);
// Routes
app.use('/generic', generic_routes_1.genericRoutes);
// Serverless export
exports.handler = (0, serverless_http_1.default)(app);
exports.default = app;
