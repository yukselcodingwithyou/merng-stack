module.exports.validateLoginUser = (username, password) => {
    errors = {};
    if (isEmpty(username)) {
        errors.username = "Username must not be empty";
    }

    if (isEmpty(password)) {
        errors.password = "Password must not be empty";
    }

    return {
        errors,
        invalid: Object.keys(errors).length > 0
    }
}

module.exports.validateRegisterUser = (username, email, password, confirmPassword) => {
    errors = {};
    if (isEmpty(username)) {
        errors.username = "Username must not be empty";
    }

    if (isEmpty(email)) {
        errors.email = "Email must not be empty";
    } else {
        if (invalidEmail(email)) {
            errors.email = "Email format invalid";
        }
    }

    if (isEmpty(password)) {
        errors.password = "Password must not be empty";
    } else {
        if (password.localeCompare(confirmPassword) !== 0) {
            errors.password = "Passwords must match";
        }
    }
    return {
        errors,
        invalid: Object.keys(errors).length > 0
    }

}

module.exports.validateCreateComment = (body) => {
    errors = {};
    if (isEmpty(body)) {
        errors.body = "Comment body must not be empty";
    }

    return {
        errors,
        invalid: Object.keys(errors).length > 0
    }
}

const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
invalidEmail = email => !regEx.test(email)

isEmpty = str => (!str ||  str.length === 0)