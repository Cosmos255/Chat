const jwt = require('jsonwebtoken');
const config = require('./config.js')

class Token {
    constructor() {
        this.secretKey = config.JWT_SECRET_KEY;
    }

    generateToken(payload) {
        const token = jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
        
        const cookie = ('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 3600000, // 1 hour in milliseconds
        })

        return cookie;
    }

    verifyToken(token) {
        try {
            verTok = jwt.verify(token, this.secretKey);
            return verTok.jti;
        } catch (error) {
            return null;
        }
    }

    blacklistToken(token) {
        config.blacklistTokens.add(token);
        return true
    }
}

module.exports = new Token();