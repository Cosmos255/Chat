const jwt = require('jsonwebtoken');
const config = require('./config.js')

class Token {
    constructor() {
        this.secretKey = config.JWT_SECRET_KEY;
    }

    generateToken(payload) {
        const token = jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
    
        return token;
    }

    async verifyToken(token) {
        try {
            verTok = await jwt.verify(token, this.secretKey);
            return verTok;
        } catch (error) {
            console.log(error);
            return jwt.verify(token, this.secretKey);
        }
    }

    blacklistedToken(token) {
        config.blacklistTokens.add(token);
        return true
    }
}

module.exports = new Token();