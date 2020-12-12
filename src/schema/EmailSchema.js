const Joi = require('@hapi/joi');

module.exports = {

    EmailSchema : Joi.object({ 
        uid: Joi.number().integer().required(),
        email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().trim().empty('').allow(null),
    }),
    
    FilterGetAll : Joi.object({
        id: Joi.number().integer(),
        uid: Joi.number().integer(),
        email: Joi.string().trim().empty(''),
        password: Joi.string(),
        searchMax: Joi.number().optional(),
        searchPage: Joi.number().optional(),
        searchOrder: Joi.array().items(
            Joi.array().items(Joi.string()),
        ).default([['createdAt', 'DESC']]),
    }),
    
    FilterGetSingle : Joi.object({ 
        id: Joi.number().integer(),
        uid: Joi.number().integer(),
        email: Joi.string().trim().empty(''),
        password: Joi.string(),
        searchMax: Joi.custom(() => 1).default(1),
        searchPage: Joi.custom(() => 1).default(1),
    }).or('id', 'uid', 'email', 'password'),

    FilterEdit : Joi.object({ id: Joi.number().integer().required() }),
    
    FilterDelete : Joi.object({ id: Joi.number().integer().required() })
}


