const {
    CredentialService,
    AccountService
} = require("../service")

class CredentialMiddleware {

    constructor() {
        this.credentialService = new CredentialService();
        this.accountService = new AccountService();
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.verifyToken = this.verifyToken.bind(this);
    }

    async signIn(req, res, next) {
        try {
            const { credential } = req.body;
            const account = await this.credentialService.signIn(credential);
            res.locals.result.account = account;
            next();
        } catch (err) {
            next(err)
        }
    }

    async signUp(req, res, next) {
        try {
            const { credential } = req.body;
            const account = await this.credentialService.signUp(credential);
            res.locals.result.account = account;
            next();
        } catch (err) {
            next(err)
        }
    }

    async verifyToken(req, res, next) {
        try {
            // Get Authorization header from the request
            const authHeader = req.get('authorization');
            const data = authHeader.split(' ');
            const token = data[1];

            // Verify & get token data
            const tokenData = await this.credentialService.verifyToken(token);

            // Get account
            const account = await this.accountService.getSingleAccountDetail({ uid: tokenData.uid });
            res.locals.result.account = account;
            next();
        } catch (err) {
            next(err)
        }
    }

}

module.exports = CredentialMiddleware;