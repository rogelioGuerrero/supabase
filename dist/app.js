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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(auth_middleware_1.authMiddleware);
// Routes
app.use('/generic', generic_routes_1.genericRoutes);
// Serverless export
exports.handler = (0, serverless_http_1.default)(app);
// Local server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}
exports.default = app;
