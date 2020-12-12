const Joi = require('@hapi/joi');

module.exports = {

    AccountSchema : Joi.object({ 
        firstname: Joi.string().trim().empty('').required(),
        lastname: Joi.string().trim().empty('').allow(null),
        pathImage: Joi.string().trim().empty('').allow(null),
    }),
    
    FilterGetAll : Joi.object({
        uid: Joi.number().integer().required(),
        idGoogleProfile: Joi.string().trim().empty(''),
        searchMax: Joi.number().optional(),
        searchPage: Joi.number().optional(),
        searchOrder: Joi.array().items(
            Joi.array().items(Joi.string()),
        ).default([['createdAt', 'DESC']]),
    }),
    
    FilterGetSingle : Joi.object({ 
        uid: Joi.number().integer().required(),
        searchMax: Joi.custom(() => 1).default(1),
        searchPage: Joi.custom(() => 1).default(1),
    }),

    FilterEdit : Joi.object({ id: Joi.number().integer().required() }),
    
    FilterDelete : Joi.object({ id: Joi.number().integer().required() }),
}


