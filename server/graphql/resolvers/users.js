const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { validateRegisterUser, validateLoginUser } = require('../../utils/validators.js')
const { SECRET_KEY } = require('../../config.js');


module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, invalid } = validateLoginUser(username, password);
            if (invalid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ username: username })
            if (!user) {
                throw new UserInputError("Wrong username!")
            }

            let passwordsNotMatch = !(await bcrypt.compare(password, user.password))
            if (passwordsNotMatch) {
                throw new UserInputError("Wrong password!")
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token: token
            }
        },

        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            const { errors, invalid } = validateRegisterUser(username, email, password, confirmPassword);
            console.log(invalid)
            if (invalid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ username: username })
            if (user) {
                console.log(user)
                throw new UserInputError(`This username is taken: ${username}`)
            }


            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                username,
                password,
                email,
                createdAt: new Date().toISOString()
            });
            const savedUser = await newUser.save();
            const token = generateToken(savedUser);

            return {
                ...savedUser._doc,
                id: savedUser._id,
                token: token
            }
        }
    }
}

generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
}