const Joi = require('@hapi/joi');

module.exports = {

    GoogleAccountSchema : Joi.object({ 
        uid: Joi.number().integer().required(),
        email: Joi.string().email().required(),
        idGoogle: Joi.string().trim().empty('').required(),
    }),
    
    FilterGetAll : Joi.object({
        id: Joi.number().integer(),
        idGoogle: Joi.string().empty(''),
        uid: Joi.number().integer(),
        email: Joi.string().email(),
        idGoogle: Joi.string().trim().empty(''),
        searchMax: Joi.number().optional(),
        searchPage: Joi.number().optional(),
        searchOrder: Joi.array().items(
            Joi.array().items(Joi.string()),
        ).default([['createdAt', 'DESC']]),
    }),
    
    FilterGetSingle : Joi.object({ 
        id: Joi.number().integer(),
        idGoogle: Joi.string().empty(''),
        uid: Joi.number().integer(),
        email: Joi.string().email(),
        idGoogle: Joi.string().trim().empty(''),
        searchMax: Joi.custom(() => 1).default(1),
        searchPage: Joi.custom(() => 1).default(1),
    }).or('id', 'uid', 'idGoogle', 'email', 'idGoogle'),

    FilterEdit : Joi.object({ id: Joi.number().integer().required() }),
    
    FilterDelete : Joi.object({ id: Joi.number().integer().required() })
}


