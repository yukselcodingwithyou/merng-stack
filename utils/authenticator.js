const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

const { SECRET_KEY } = require('../config.js')


module.exports = (context) => {
    const authHeader = context.req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                return new AuthenticationError("Invalid/Expired Token")
            }
        }
        throw new AuthenticationError("Token must be in \'Bearer [token]\' format")
    }
    throw new AuthenticationError("Auth Header must be provided")
}