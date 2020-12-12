
const { EmailSchema } = require('../schema')
const { EmailDAO } = require('../dao')
const Service = require('./Service');
const bcrypt = require('bcrypt');

class EmailService extends Service {

    constructor() {
        super();
    }
 
    async getAllEmail(filter, option){
        try{
            const searchFilter = this.validateSchema(filter, EmailSchema.FilterGetAll);
            const allEmail = await EmailDAO.getAll(searchFilter, option);
            return allEmail;
        }catch(err){
            throw err;
        }
    }

    async getSingleEmail(filter, option){
        try{
            const searchFilter = this.validateSchema(filter, EmailSchema.FilterGetSingle);
            const result = await this.getAllEmail(searchFilter, option);
            return result.length > 0 ? result[0] : null;
        }catch(err){
            throw err;
        }
    }

    async createEmail(email, option={}) {
        try {
            // Validate
            const emailData = this.validateSchema(email, EmailSchema.EmailSchema);

            // Create
            emailData.password = await bcrypt.hash(emailData.password, 10)
            const emailCreated = await EmailDAO.create(emailData, option);

            // Get Result
            const result = await this.getSingleEmail({uid:emailCreated.uid}, option);
            return result
        } catch (err) {
            throw err;
        }
    }

    async editEmail(filter, email, option={}){
        try{
            // Find existing email
            const existingEmail = await this.getSingle(filter, option);
            if(!existingEmail) throw new Error("Email not found");

            // Validate
            const emailData = this.validateSchema(email, EmailSchema);

            // Create
            const emailEdited = await EmailDAO.edit({id:existingEmail.id}, emailData, option);

            // Get Result
            const result = await this.getSingle({id:emailEdited.id}, option);
            return result
        }catch(err){
            throw err;
        }
    }

    async deleteEmail(filter, option={}){
        try{
            // Find existing email
            const existingEmail = await this.getSingle(filter, option);
            if(!existingEmail) throw new Error("Email not found");

            // Delete
            await EmailDAO.edit({id:existingEmail.id}, option);

            // Return
            return existingEmail;
        }catch(err){
            throw err;
        }
    }

}

module.exports = EmailService;