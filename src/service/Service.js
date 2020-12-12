const Joi = require('@hapi/joi');

class Service {
	validateSchema(data, schema) {
		if (!data) throw new Error('validateSchema error, data is required');
		if (!schema) throw new Error('validateSchema error, schema is required');
		return Joi.attempt(data, schema,
			{
				allowUnknown: true,
				stripUnknown: true,
			});
	}
}

module.exports = Service;
