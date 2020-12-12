const Joi = require('@hapi/joi');
const { CREDENTIAL_TYPE } = require("../constant")
console.log(Object.values(CREDENTIAL_TYPE))
module.exports = {

    // CredentialSchema : Joi.object({ 
    //     credentialType: Joi.string().valid( ...Object.values(CREDENTIAL_TYPE) ).required(),
    //     credentialData: Joi.any().when({
    //         'credentialType': {
    //             is: "EMAIL",
    //             then: Joi.object({
    //                 email: Joi.string().trim().empty('').email({ minDomainSegments: 2 }).required(),
    //                 password: Joi.string().required(),
    //             }), 
    //         },
    //         'credentialType': {
    //             is: "Google",
    //             then: Joi.object({
    //                 idGoogle: Joi.string().trim().empty('').required(),
    //             }), 
    //         }
    //     }),
    //     accountData: Joi.object().optional(),
    // }),

    CredentialSchema : Joi.object({ 
        credentialType: Joi.string().valid( ...Object.values(CREDENTIAL_TYPE) ).required(),
        credentialData: Joi.alternatives().conditional( 'credentialType', [
            {
                is: CREDENTIAL_TYPE.EMAIL,
                then: Joi.object({
                    email: Joi.string().trim().empty('').email({ minDomainSegments: 2 }).required(),
                    password: Joi.string().required(),
                }), 
            },
            {
                is: CREDENTIAL_TYPE.GOOGLE,
                then: Joi.object({
                    idTokenGoogle: Joi.string().trim().empty('').required(),
                }), 
            }
        ]),
        accountData: Joi.object().optional(),
    }),

    TokenSchema : Joi.object({ 
        uid: Joi.number().required(),
        firstname: Joi.string().trim().empty('').required(),
        lastname: Joi.string().trim().empty('').allow(null),
    }),
    
 
}


