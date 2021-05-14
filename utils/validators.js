module.exports.validateLoginUser = (username, password) => {
    errors = {};
    if (isEmpty(username)) {
        errors.username = "Username must not be empty|null|undefined";
    }

    if (isEmpty(password)) {
        errors.password = "Password must not be empty|null|undefined";
    }

    return {
        errors,
        invalid: Object.keys(errors).length > 0
    }
}

module.exports.validateRegisterUser = (username, email, password, confirmPassword) => {
    errors = {};
    if (isEmpty(username)) {
        errors.username = "Username must not be empty|null|undefined";
    }

    if (isEmpty(email)) {
        errors.email = "Email must not be empty|null|undefined";
    } else {
        if (invalidEmail(email)) {
            errors.email = "Email format invalid";
        }
    }

    if (isEmpty(password)) {
        errors.password = "Password must not be empty|null|undefined";
    } else {
        if (password.localeCompare(confirmPassword) !== 0) {
            errors.password = "Passwords must match";
        }
    }

    console.log("errors: ", errors)
    return {
        errors,
        invalid: Object.keys(errors).length > 0
    }

}

const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
invalidEmail = email => !regEx.test(email)

isEmpty = str => (!str ||  str.length === 0)