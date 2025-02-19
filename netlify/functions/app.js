const serverless = require('serverless-http');
const app = require('../../dist/app').default;

exports.handler = serverless(app);
