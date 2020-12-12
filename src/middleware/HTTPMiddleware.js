/* eslint-disable no-console */
const ServerConfig = require('../config/ServerConfig');
const Message = require('../entities/Message');
const MESSAGE_TYPE = require('../constant/MESSAGE_TYPE');

exports.onRequest = function (req, res, next) {
	try {
		if (ServerConfig.DEBUG_SERVER) {
			console.log('\nRequest received');
			console.log(`url : ${req.originalUrl}`);
			console.log('method :', req.method);
			console.log('query :', req.query);
			console.log('body :', req.body);
		}
		res.locals.result = res.locals.result || {};
		next();
	} catch (err) {
		next(err);
	}
};

exports.sendSuccess = function (req, res, next) {
	try {
		const data = res.locals.result;
		const message = new Message(MESSAGE_TYPE.SUCCESS, data);
		res.json(message);

		if (ServerConfig.DEBUG_SERVER) {
			console.log('');
			console.log('Response send');
			console.log(message);
		}
	} catch (err) {
		next(err);
	}
};

// eslint-disable-next-line consistent-return
exports.sendError = function sendError(err, req, res, next) {
	try {
		if (res.headersSent) {
			return next(err);
		}

		// Prevent circular
		const s = JSON.stringify(err, Object.getOwnPropertyNames(err));
		const errorNotCircular = JSON.parse(s);

		// Setup result message
		let msg = null;
		if (ServerConfig.DEBUG_SERVER) {
			msg = new Message(MESSAGE_TYPE.ERROR, errorNotCircular);
			console.log('');
			console.log('Respnose Error :');
			console.log(err);
		} else {
			msg = new Message(MESSAGE_TYPE.ERROR, { message: errorNotCircular.message });
		}

		// Send
		res.json(msg);
	} catch (error) {
		console.error("Fatal Error in 'sendError'", error);
		next(error);
	}
};
