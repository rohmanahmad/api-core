'use strict'

const {OAuth2Client} = require('google-auth-library')

class GoogleAuthHelper {
    constructor (instance) {
        this.instance = instance
    }

    async check ({clientid, token}) {
        const client = new OAuth2Client(clientid);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientid,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        /* 
            payload: {
                at_hash: "dT11CoCAXcBHzpUyJdQHHg"
                aud: "984117247011-eu2qv2orhkusg60tdr21t2itcprgskis.apps.googleusercontent.com"
                azp: "984117247011-eu2qv2orhkusg60tdr21t2itcprgskis.apps.googleusercontent.com"
                email: "rohmanmail@gmail.com"
                email_verified: true
                exp: 1598025288
                family_name: "Ahmad"
                given_name: "Rohman"
                iat: 1598021688
                iss: "accounts.google.com"
                jti: "dceb907af399479a0b2e44d98a38038bbc8eaa67"
                locale: "en"
                name: "Rohman Ahmad"
                picture: "https://lh3.googleusercontent.com/a-/AOh14GhD_xN71QePMs5MJgdhzta4dUkbwisuicVW62s_sg=s96-c"
                sub: "116249124761026552094"
            }
        */
        const userid = payload['sub'];
        if (userid) return true
        return false
    }
}

module.exports = function (instance) {
    return new GoogleAuthHelper(instance)
}