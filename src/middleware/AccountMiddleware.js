const { 
    AccountService 
} = require("../service")

class AccountMiddleware{

    constructor(){
        this.accountService = new AccountService();
    }

    async getAllAccount(req, res, next){
        try{
            const filter = req.query.params;
            const allAccount = await this.accountService.getAllAccount(filter);
            res.locals.result.allAccount = allAccount;
            next();
        }catch(err){
            next(err);
        }
    }

    async getSingleAccount(req, res, next){
        try{
            const filter = req.query.params;
            const account = await this.accountService.getAllAccount(filter);
            res.locals.result.account = account;
            next();
        }catch(err){
            next(err);
        }
    }

    async createAccount(req, res, next){
        try{
            const { account} = req.body;
            const account = await this.accountService.createAccount(account);
            res.locals.result.account = account;
            next();
        }catch(err){
            next(err)
        }
    }

    async editAccount(req, res, next){
        try{
            const {filter, account} = req.query.body;
            const account = await this.accountService.editAccount(filter, account);
            res.locals.result.account = account;
            next();
        }catch(err){
            next(err)
        }
    }

    async deleteAccount(req, res, next){
        try{
            const {filter} = req.query.body;
            const account = await this.accountService.deleteAccount(filter);
            res.locals.result.account = account;
            next();
        }catch(err){
            next(err)
        }
    }

}

module.exports = AccountMiddleware;