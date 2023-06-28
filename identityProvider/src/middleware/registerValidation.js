const Joi = require('joi');

const registerForm = Joi.object({
    username: Joi.string().trim().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/
    ).required(),
    email: Joi.string().trim().regex(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ).required(),
    password: Joi.string().trim().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    ).required(),
    verifyPassword: Joi.string().trim().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    ).required()
});

const doesPasswordsMatch = (password, verifyPassword) => {
    return password === verifyPassword
}

module.exports = {
    validateBody: (req, res, next) => {
        const body = req.body
        const result = registerForm.validate(body, { stripUnknown: true, abortEarly: false });
        if (result.error || !doesPasswordsMatch(body.password, body.verifyPassword)) {
            return res.status(400).json({reason: 'Invalid request'});
        }
        next()
    }
}