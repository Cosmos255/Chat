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

    verifyToken(token) {
        try {
            verTok = jwt.verify(token, this.secretKey);
            return verTok;
        } catch (error) {
            return null;
        }
    }

    blacklistedToken(token) {
        config.blacklistTokens.add(token);
        return true
    }
}

module.exports = new Token();