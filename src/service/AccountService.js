
const { AccountSchema, CredentialSchema } = require('../schema');
const { CREDENTIAL_TYPE } = require('../constant')
const { AccountDAO } = require('../dao')
const Service = require('./Service');
const GoogleAccountService = require('./GoogleAccountService');
const EmailService = require('./EmailService');


class AccountService extends Service {

    constructor() {
        super();
        this.googleAccountService = new GoogleAccountService();
        this.emailService = new EmailService();
    }
 
    async getAllAccount(filter, option){
        try{
            const searchFilter = this.validateSchema(filter, AccountSchema.FilterGetAll);
            const allAccount = await AccountDAO.getAll(searchFilter, option);
            return allAccount;
        }catch(err){
            throw err;
        }
    }

    async getSingleAccount(filter, option){
        try{
            const searchFilter = this.validateSchema(filter, AccountSchema.FilterGetSingle);
            const result = await this.getAllAccount(searchFilter, option);
            return result.length > 0 ? result[0] : null;
        }catch(err){
            throw err;
        }
    }

    async getSingleAccountByCredential(filterCredential, option){
        try{
            const cred = this.validateSchema(filterCredential, CredentialSchema.CredentialSchema);

            let uidAccount = null;

            // Get by email
            if(cred.credentialType === CREDENTIAL_TYPE.EMAIL){
                const {email, password} = await cred.credentialData;
                if(!email) throw new Error("email is required");
                if(!password) throw new Error("password is required");

                const existingEmail = await this.emailService.getSingleEmail({email:email}, option);
                if(!existingEmail) return null;

                uidAccount = existingEmail.uid;
            }

            else if(cred.credentialType === CREDENTIAL_TYPE.GOOGLE){
                const goggleAccount = await this.googleAccountService.getSingleAccount({idGoogle:idGoogle}, option);
                if(!goggleAccount) return null;

                uidAccount = goggleAccount.uid;
            }
            if(!uidAccount) throw new Error('Account not found');

            const account = await this.getSingleAccountDetail({uid:uidAccount}, option);
            return account;
        }catch(err){
            throw err;
        }
    }

    async getAllAccountDetail(filter, option){
        try{
            const searchFilter = this.validateSchema(filter, AccountSchema.FilterGetAll);
            const allAccount = await AccountDAO.getAll(searchFilter, option);
            for(const account of allAccount){
                account.credentialEmail = await this.emailService.getSingleEmail({uid:account.uid}, option);
                account.credentialGoogle = await this.googleAccountService.getSingleAccount({uid:account.uid}, option);
            }
            return allAccount;
        }catch(err){
            throw err;
        }
    }

    async getSingleAccountDetail(filter, option){
        try{
            const searchFilter = this.validateSchema(filter, AccountSchema.FilterGetSingle);
            const accountArray = await this.getAllAccountDetail(searchFilter);
            return accountArray.length > 0 ? accountArray[0] : null;
        }catch(err){
            throw err;
        }
    }

    async createAccount(account, option={}) {
        try {
            // Validate
            const accountData = this.validateSchema(account, AccountSchema.AccountSchema);

            // Create
            const accountCreated = await AccountDAO.create(accountData, option);

            // Get Result
            const result = await this.getSingleAccount({uid:accountCreated.uid}, option);
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
            const accountData = this.validateSchema(account, AccountSchema);

            // Create
            const accountEdited = await AccountDAO.edit({id:existingAccount.id}, accountData, option);

            // Get Result
            const result = await this.getSingle({id:accountEdited.id}, option);
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
            await AccountDAO.edit({id:existingAccount.id}, option);

            // Return
            return existingAccount;
        }catch(err){
            throw err;
        }
    }

}

module.exports = AccountService;