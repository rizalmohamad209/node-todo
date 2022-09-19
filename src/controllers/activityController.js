const { activity } = require("../models");
const fs = require('fs');

const __dirnames = process.cwd();
const dataCache = `${__dirnames}/src/cache/activity.json`

const saveActivity = (data) => {
    console.log(data);
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataCache, stringifyData)
};
const getActivity = () => {
    const jsonData = fs.readFileSync(dataCache)
    return JSON.parse(jsonData)
};
module.exports = {
    getAllActivity: async (req, res) => {
        try {
            const cacheActivity = getActivity()
            res.status(200).send({
                status: "Success",
                message: "Success",
                data: cacheActivity
            })
        } catch (err) {
            res.status(500).send(err)
        }

    },
    postActivity: async (req, res) => {
        try {
            const cacheActivity = getActivity()
            const { body } = req;
            const result = await activity.create(body);
            const newData = {
                ...result._previousDataValues,
                deletedAt: null,
                email: body.email ? body.email : "",
                id: parseInt(result._previousDataValues.id)
            }
            cacheActivity.push(newData);
            saveActivity(cacheActivity);
            res.status(201).send({
                status: "Success",
                message: "Success",
                data: newData
            })

        } catch (err) {
            res.status(500).send(err)
        }
    },
    getActivityById: async (req, res) => {
        try {
            const cacheActivity = getActivity()
            const result = cacheActivity.filter(activity => activity.id === parseInt(req.params.id))
            res.status(200).send({
                status: "Success",
                message: "Success",
                data: result[0]
            })
        } catch (err) {
            res.status(500).send(err)

        }
    },
    updateActivity: async (req, res) => {
        const { title } = req.body;
        const cacheActivity = getActivity()
        const findActivity = cacheActivity.filter(activity => activity.id === parseInt(req.params.id));
        const updateActivity = cacheActivity.filter(activity => activity.id !== parseInt(req.params.id));
        const newData = {
            id: findActivity[0]?.id,
            email: findActivity[0]?.email,
            title: title,
            deletedAt: null,
            updatedAt: new Date().toISOString(),
            createdAt: findActivity[0]?.createdAt
        }
        updateActivity.push(newData);
        await activity.update(newData, { where: { id: req.params.id } }).then(() => {
            saveActivity(updateActivity)
            res.status(200).send({
                status: "Success",
                message: "Success",
                data: newData
            })

        }).catch(err => {
            res.status(500).send(err)
        })
    },
    deleteActivity: async (req, res) => {
        const cacheActivity = getActivity();
        const newCacheActivity = cacheActivity.filter(activity => activity.id !== parseInt(req.params.id));
        await activity.destroy({ where: { id: req.params.id } }).then(() => {
            saveActivity(newCacheActivity)
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