
const { CredentialSchema } = require('../schema')
const Service = require('./Service');
const AccountService = require('./AccountService');
const GoogleService = require('./GoogleAccountService');
const GoogleProvider = require('./GoogleProvider');
const { CREDENTIAL_TYPE } = require('../constant')
const { ServerConfig } = require('../config')
const bcrypt = require('bcrypt');
const EmailService = require('./EmailService');
const JWT = require('jsonwebtoken');

class CredentialService extends Service {

    constructor() {
        super();
        this.accountService = new AccountService();
        this.emailService = new EmailService();
        this.googleService = new GoogleService();
        this.googleProvider = new GoogleProvider();
    }

    async signIn(credentialSchema, option){
        try{
            // Get existing account
            const credential = this.validateSchema(credentialSchema, CredentialSchema.CredentialSchema);
            
            // Sign in by email
            if(credential.credentialType === CREDENTIAL_TYPE.EMAIL){
                const account = await this.accountService.getSingleAccountByCredential(credential, option);
                if(!account){
                    throw new Error("Account Not Found");
                }else{
                    const password = credential.credentialData.password;
                    const credentialEmail = account.credentialEmail;
                    const isValid = bcrypt.compare(password, credentialEmail.password);
                    if(!isValid) throw new Error("Invalid email or password");

                    account.token = await this.createToken({
                        uid:account.uid,
                        firstname:account.firstname,
                        lastname:account.lastname
                    });
                    return account;
                }
            }   

            // Sign in by google
            else if(credential.credentialType === CREDENTIAL_TYPE.GOOGLE){
                const idTokenGoogle = credentialSchema.credentialData.idTokenGoogle;

                // Validate token google
                const googleData = await this.googleProvider.verifyIdTokenGoogle(idTokenGoogle);
                if(!googleData) throw new Error("Invalid idTokenGoogle");

                // Get existing google account
                const existingGoogleAccount = await this.googleService.getSingleAccount({idGoogle:googleData.sub}, option);

                if(!existingGoogleAccount) {
                    return this.signUp(credentialSchema, option);
                }else{
                    const account = await this.accountService.getSingleAccountDetail({uid:existingGoogleAccount.uid}, option);
                    if(!account) throw new Error("account not found") // should not happen

                    account.token = await this.createToken({
                        uid:account.uid,
                        firstname:account.firstname,
                        lastname:account.lastname
                    });
                    return account;
                }
            }

            else{
                throw new Error("Unknown credential type")
            }
        }catch(err){
            throw err;
        }
    }

    async signUp(credentialSchema, option){
        try{
            // Get existing account
            const credential = this.validateSchema(credentialSchema, CredentialSchema.CredentialSchema);
            
            if(credential.credentialType === CREDENTIAL_TYPE.EMAIL){
                const account = await this.accountService.getSingleAccountByCredential(credential, option);
                if(account) throw new Error("Account already exist");

                // create account
                const newAccount = {
                    firstname: credential.accountData.firstname,
                    lastname: credential.accountData.lastname,
                }
                const accountCreated = await this.accountService.createAccount(newAccount);

                // Create Email
                const newEmail = {
                    uid: accountCreated.uid,
                    email: credential.credentialData.email,
                    password: credential.credentialData.password, 
                }
                await this.emailService.createEmail(newEmail, option);

                // get result
                const result = await this.accountService.getSingleAccountDetail({uid:accountCreated.uid})
                return result;
            }

            else if(credential.credentialType === CREDENTIAL_TYPE.GOOGLE){

                const idTokenGoogle = credentialSchema.credentialData.idTokenGoogle;

                // Validate token google
                const googleData = await this.googleProvider.verifyIdTokenGoogle(idTokenGoogle);
                if(!googleData) throw new Error("Invalid idTokenGoogle");

                const existingGoogleAccount = await this.googleService.getSingleAccount({idGoogle:googleData.sub}, option);
                if(existingGoogleAccount){
                    return this.signIn(credentialSchema, option);
                }

                // create account
                const newAccount = {
                    firstname: googleData.given_name,
                    lastname: googleData.family_name,
                }
                const accountCreated = await this.accountService.createAccount(newAccount);

                // create google account
                const newAccountGoogle = {
                    uid: accountCreated.uid,
                    email: googleData.email,
                    idGoogle: googleData.sub
                }
                await this.googleService.createAccount(newAccountGoogle);

                // get result
                const result = await this.accountService.getSingleAccountDetail({uid:accountCreated.uid})
                return result;
            }
        }catch(err){
            throw err;
        }
    }
 
    async createToken(tokenSchema) {
        try {
            // Validate
            const data = this.validateSchema(tokenSchema, CredentialSchema.TokenSchema);

            // Create token
            const token = JWT.sign({ ...data }, ServerConfig.JWT_SECRET);
            return token;
        } catch (err) {
            throw err;
        }
    }

    async verifyToken(token){
        return JWT.verify(token, ServerConfig.JWT_SECRET);
    }



}

module.exports = CredentialService;