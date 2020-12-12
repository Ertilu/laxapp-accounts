const { 
    EmailService 
} = require("../service")

class EmailMiddleware{

    constructor(){
        this.accountService = new EmailService();
    }

    async getAllEmail(req, res, next){
        try{
            const filter = req.query.params;
            const allEmail = await this.accountService.getAllEmail(filter);
            res.locals.result.allEmail = allEmail;
            next();
        }catch(err){
            next(err);
        }
    }

    async getSingleEmail(req, res, next){
        try{
            const filter = req.query.params;
            const account = await this.accountService.getAllEmail(filter);
            res.locals.result.account = account;
            next();
        }catch(err){
            next(err);
        }
    }

    async createEmail(req, res, next){
        try{
            const { account} = req.body;
            const account = await this.accountService.createEmail(account);
            res.locals.result.account = account;
            next();
        }catch(err){
            next(err)
        }
    }

    async editEmail(req, res, next){
        try{
            const {filter, account} = req.query.body;
            const account = await this.accountService.editEmail(filter, account);
            res.locals.result.account = account;
            next();
        }catch(err){
            next(err)
        }
    }

    async deleteEmail(req, res, next){
        try{
            const {filter} = req.query.body;
            const account = await this.accountService.deleteEmail(filter);
            res.locals.result.account = account;
            next();
        }catch(err){
            next(err)
        }
    }

}

module.exports = EmailMiddleware;