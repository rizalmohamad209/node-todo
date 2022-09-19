const { body, param, validationResult } = require("express-validator");
const fs = require('fs');

const __dirnames = process.cwd();
const dataCache = `${__dirnames}/src/cache/activity.json`

const getActivity = () => {
    const jsonData = fs.readFileSync(dataCache)
    return JSON.parse(jsonData)
};

module.exports = {
    validatePost: [
        body("title").notEmpty().withMessage("title cannot be null"),
        (req, res, next) => {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                const Result = {
                    ...error
                }
                return res.status(400).send({ status: "Bad Request", message: `${Result.errors[0]?.msg}`, data: {} });
            }
            next()
        }
    ],
    validateDelete: [
        param("id").notEmpty().withMessage('param id is required').bail().isNumeric().withMessage("id must be an integer").bail().custom(async (value, { req }) => {
            // const checking = await activity.findOne({ where: { id: value } })
            const cacheActivity = getActivity();
            const checking = cacheActivity.filter(activity => activity.id === parseInt(value))

            if (checking.length <= 0) {
                return Promise.reject(`Activity with ID ${value} Not Found`)
            }
        }),
        (req, res, next) => {
            const error = validationResult(req);

            if (!error.isEmpty()) {
                const Result = {
                    ...error
                }
                return res.status(404).send({ status: "Not Found", message: `${Result.errors[0]?.msg}`, data: {} });
            }
            next();
        },
    ],
    validateGetById: [
        param("id").notEmpty().withMessage("param id is required").bail().isNumeric().withMessage("id must be an integer").bail().custom(
            async (value, { req }) => {
                const cacheActivity = getActivity();
                const checking = cacheActivity.filter(activity => activity.id === parseInt(value))
                console.log(checking.length);
                if (checking.length <= 0) {
                    return Promise.reject(`Activity with ID ${value} Not Found`)
                }
            }
        ),
        (req, res, next) => {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                const Result = {
                    ...error
                }
                return res.status(404).send({ status: "Not Found", message: `${Result.errors[0]?.msg}`, data: {} });
            }
            next()
        }
    ],
    validateUpdate: [
        body("title").notEmpty(),
        (req, res, next) => {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).send({ status: "Bad Request", message: "title cannot be null", data: {} });
            }
            next()
        },
        param("id").notEmpty().withMessage("param id is required").bail().isNumeric().withMessage("id must be an integer").bail().custom(
            async (value, { req }) => {
                const cacheActivity = getActivity();
                const checking = cacheActivity.filter(activity => activity.id === parseInt(value))
                if (checking.length <= 0) {
                    return Promise.reject(`Activity with ID ${value} Not Found`)
                }
            }
        ),
        (req, res, next) => {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                const Result = {
                    ...error
                }
                return res.status(404).send({ status: "Not Found", message: `${Result.errors[0]?.msg}`, data: {} });
            }
            next()
        }
    ]
}