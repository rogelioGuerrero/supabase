const serverless = require('serverless-http');
const app = require('../../dist/app').default;

console.log('Iniciando serverless function');
console.log('Configuración de app:', app);

module.exports.handler = serverless(app, {
  binary: ['*/*']
});

// Logging de errores
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
