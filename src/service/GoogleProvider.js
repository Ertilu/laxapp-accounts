const { OAuth2Client } = require('google-auth-library');
const { GoogleConfig } = require('../config');

class GoogleProvider{

    constructor(){
        this.OAuth2Client = new OAuth2Client(GoogleConfig.CLIENT_ID);
        this.verifyIdTokenGoogle = this.verifyIdTokenGoogle.bind(this);
    }

    async verifyIdTokenGoogle(idGoogle) {
        try {
            if (!idGoogle) throw new Error("idGoogle is required");
            const ticket = await this.OAuth2Client.verifyIdToken({
                idToken: idGoogle,
                audience: GoogleConfig.CLIENT_ID,
            });
            const payload = ticket.getPayload();
            return payload;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = GoogleProvider;