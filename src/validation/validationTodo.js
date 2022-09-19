const { body, param, validationResult } = require("express-validator");
const fs = require('fs');

const __dirnames = process.cwd();
const dataCacheTodo = `${__dirnames}/src/cache/todo.json`
const dataCacheActivity = `${__dirnames}/src/cache/activity.json`

const getTodo = () => {
    const jsonData = fs.readFileSync(dataCacheTodo)
    return JSON.parse(jsonData)
};

const getActivity = () => {
    const jsonData = fs.readFileSync(dataCacheActivity)
    return JSON.parse(jsonData)
};

module.exports = {
    validatePost: [
        body("activity_group_id").notEmpty().withMessage("activity_group_id cannot be null").bail().isNumeric().withMessage("id must be an integer").bail().custom((value, { req }) => {
            const cacheActivity = getActivity();
            const checking = cacheActivity.filter(activity => activity.id == value)
            console.log(checking.length);
            console.log(checking);
            if (checking <= 0) {
                return Promise.reject(`Activity with activity_group_id ${value} Not Found`)
            } else {
                return true
            }
        }),
        (req, res, next) => {
            const error = validationResult(req);
            console.log(error);
            if (!error.isEmpty()) {
                const Result = {
                    ...error
                }
                return res.status(400).send({ status: "Bad Request", message: `${Result.errors[0]?.msg}`, data: {} });
            }
            next()
        },
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
        param("id").notEmpty().withMessage('param id is required').bail().isNumeric().withMessage("id must be an integer").bail().custom((value, { req }) => {
            const cacheTodo = getTodo();
            const checking = cacheTodo.filter(todo => todo.id === parseInt(value))
            if (checking <= 0) {
                return Promise.reject(`Todo with ID ${value} Not Found`)
            } else {
                return true
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
            (value, { req }) => {
                const cacheTodo = getTodo();
                const checking = cacheTodo.filter(todo => todo.id === parseInt(value))
                if (checking <= 0) {
                    return Promise.reject(`Todo with ID ${value} Not Found`)
                } else {
                    return true
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
        param("id").notEmpty().withMessage("param id is required").bail().isNumeric().withMessage("id must be an integer").bail().custom(
            (value, { req }) => {
                const cacheTodo = getTodo();
                const checking = cacheTodo.filter(todo => todo.id === parseInt(value))
                if (checking <= 0) {
                    return Promise.reject(`Todo with ID ${value} Not Found`)
                } else {

                    return true
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