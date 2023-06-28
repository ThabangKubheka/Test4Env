const Joi = require('joi');

const loginForm = Joi.object({
    email: Joi.string().trim().regex(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ).required(),
    password: Joi.string().trim().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    ).required(),
});

module.exports = {
    validateBody: (req, res, next) => {
        const body = req.body
        const result = loginForm.validate(body, { stripUnknown: true, abortEarly: false });
        if (result.error) {
            return res.status(400).json({message: 'Invalid request'});
        }
        next()
    }
}