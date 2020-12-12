// Import depencies
require('dotenv').config({ path: '.env' });
const Express = require('express');
const CORS = require('cors');
const bodyParser = require('body-parser');
const { ServerConfig } = require('./config');

// Import router
const PublicRouter = require('./router/rest/PublicRouter');

// Initialize server
const express = Express();
express.use(bodyParser.json({ limit: '10mb', extended: true }));
express.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
express.use(CORS());

// Setup router
express.use('/static', Express.static('./src/static'))
express.use('/rest/public', PublicRouter);

// Start server
express.listen(ServerConfig.PORT);
console.log('\n=======================================');
console.log(`SERVER listening on PORT : ${ServerConfig.PORT}`);
console.log('=======================================\n');
