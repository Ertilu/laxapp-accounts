const JWT = require('jsonwebtoken');
const {
    AccountService,
    GoogleAccountService,
    GoogleProvider
} = require("../service");

class GoogleAccountMiddleware{

    constructor(){
        this.accountService = new AccountService();
        this.googleAccountService = new GoogleAccountService();
        this.googleProvider = new GoogleProvider();
        this.verifyIdTokenGoogle = this.verifyIdTokenGoogle.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    async verifyIdTokenGoogle(req, res, next){
        try{
            const idTokenGoogle = req.body.idTokenGoogle;
            const googleProfile = await this.googleProvider.verifyIdTokenGoogle(idTokenGoogle);
            res.locals.result.googleProfile = googleProfile;
            next();
        }catch(err){
            next(err);
        }
    }

    async signIn(req, res, next){
        try{
            const idTokenGoogle = req.body.idTokenGoogle;
            if(!idTokenGoogle) throw new Error("idTokenGoogle is required")

            // Validate token google
            const isValid = await this.googleProvider.verifyIdTokenGoogle(idTokenGoogle);
            if(!isValid) throw new Error("Invalid idTokenGoogle");

            // Get google provider data
            const googleData = await this.googleProvider.getAccount({idTokenGoogle});
            if(!googleData) throw new Error("Google Data is missing");

            // Get existing account
            let accountGoogle = await this.googleAccountService.getSingleAccount({email:googleData.email});
            if(!accountGoogle){
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
                accountGoogle = await this.googleAccountService.createAccount(newAccountGoogle);
            }

            const result = await this.accountService.getSingleAccountDetail({uid:accountGoogle.uid});
            res.locals.result.account = result;
            next();
        }catch(err){
            next(err)
        }
    }

}

module.exports = new GoogleAccountMiddleware();