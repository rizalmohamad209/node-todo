const { todo } = require("../models");
const fs = require('fs');

const __dirnames = process.cwd();

const dataCache = `${__dirnames}/src/cache/todo.json`
const saveTodo = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataCache, stringifyData)
};
getTodo = () => {
    const jsonData = fs.readFileSync(dataCache)
    return JSON.parse(jsonData)
};
module.exports = {
    postTodo: async (req, res, next) => {
        try {
            const existTodo = getTodo()
            const { body } = req;
            const newData = {
                is_active: true,
                priority: "very-high",
                ...body,
            }
            const result = await todo.create(newData);
            const cache = {
                ...result._previousDataValues,
                deletedAt: null
            }
            existTodo.push(cache);
            saveTodo(existTodo);
            res.status(201).send({
                status: "Success",
                message: "Success",
                data: cache
            })
        } catch (err) {
            next(err)
        }
    },
    getAllTodo: async (req, res) => {
        try {
            const { activity_group_id } = req.query
            const existTodo = getTodo()
            if (activity_group_id === "") {
                res.status(200).send({
                    status: "Success",
                    message: "Success",
                    data: existTodo
                })
            } else {
                const result = existTodo.filter(todo => parseInt(todo.activity_group_id) == activity_group_id);
                res.status(200).send({
                    status: "Success",
                    message: "Success",
                    data: result
                })
            }
        } catch (err) {
            res.status(500).send(err)


        }
    },
    getTodoById: async (req, res) => {
        try {
            const existTodo = getTodo()
            const todoById = existTodo.filter(todo => todo.id === parseInt(req.params.id))
            res.status(200).send({
                status: "Success",
                message: "Success",
                data: todoById[0]
            })
        } catch (err) {
            res.status(500).send(err)
        }
    },
    updateTodo: async (req, res) => {
        const { is_active, title, priority } = req.body;
        const existTodo = getTodo()
        const findTodo = existTodo.filter(todo => todo.id === parseInt(req.params.id))
        const updateUser = existTodo.filter(todo => todo.id !== parseInt(req.params.id))
        const newData = {
            id: findTodo[0]?.id,
            is_active: is_active ? is_active : findTodo[0]?.is_active,
            title: title ? title : findTodo[0]?.title,
            priority: priority ? priority : findTodo[0]?.priority,
            createdAt: findTodo[0]?.createdAt,
            activity_group_id: findTodo[0]?.activity_group_id,
            updatedAt: new Date().toISOString(),
            deletedAt: null
        }
        updateUser.push(newData);
        await todo.update(newData, {
            where: { id: findTodo[0]?.id },
        }).then(() => {
            saveTodo(updateUser);
            res.status(200).send({
                status: "Success",
                message: "Success",
                data: newData
            })
        }).catch(err => {
            res.status(500).send(err)
        })
    },
    deleteTodo: async (req, res) => {
        const existTodo = getTodo()
        const newCacheTodo = existTodo.filter(todo => todo.id !== parseInt(req.params.id))
        await todo.destroy({ where: { id: req.params.id } }).then(() => {
            saveTodo(newCacheTodo);
            res.status(200).send({
                status: "Success",
                message: "Success",
                data: {}
            })
        }).catch(err => {
            res.status(500).send(err)
        })
    }
}
