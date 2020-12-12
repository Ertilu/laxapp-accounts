
const { GoogleAccountSchema } = require('../schema')
const { GoogleAccountDAO } = require('../dao')
const Service = require('./Service');

class GoogleAccountService extends Service {

    constructor() {
        super()
    }

    async getAllAccount(filter, option){
        try{
            const searchFilter = this.validateSchema(filter, GoogleAccountSchema.FilterGetAll);
            const allAccount = await GoogleAccountDAO.getAll(searchFilter, option);
            return allAccount;
        }catch(err){
            throw err;
        }
    }

    async getSingleAccount(filter, option){
        try{
            const searchFilter = this.validateSchema(filter, GoogleAccountSchema.FilterGetSingle);
            const result = await this.getAllAccount(searchFilter, option);
            return result.length > 0 ? result[0] : null;
        }catch(err){
            throw err;
        }
    }

    async createAccount(account, option={}) {
        try {
            // Validate
            const accountData = this.validateSchema(account, GoogleAccountSchema.GoogleAccountSchema);

            // Create
            const accountCreated = await GoogleAccountDAO.create(accountData, option);

            // Get Result
            const result = await this.getSingleAccount({id:accountCreated.id}, option);
            return result
        } catch (err) {
            throw err;
        }
    }

    async editAccount(filter, account, option={}){
        try{
            // Find existing account
            const existingAccount = await this.getSingle(filter, option);
            if(!existingAccount) throw new Error("Account not found");

            // Validate
            const accountData = this.validateSchema(account, GoogleAccountSchema);

            // Create
            const accountEdited = await GoogleAccountDAO.edit({id:existingAccount.id}, accountData, option);

            // Get Result
            const result = await this.getSingleAccount({id:accountEdited.id}, option);
            return result
        }catch(err){
            throw err;
        }
    }

    async deleteAccount(filter, option={}){
        try{
            // Find existing account
            const existingAccount = await this.getSingle(filter, option);
            if(!existingAccount) throw new Error("Account not found");

            // Delete
            await GoogleAccountDAO.edit({id:existingAccount.id}, option);

            // Return
            return existingAccount;
        }catch(err){
            throw err;
        }
    }

}

module.exports = GoogleAccountService;