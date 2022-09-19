const todoRoute = require("express").Router();
const todoController = require("../controllers/todoController");
const { validateUpdate, validatePost, validateDelete, validateGetById } = require("../validation/validationTodo")

todoRoute.get("/", todoController.getAllTodo);
todoRoute.get("/:id", validateGetById, todoController.getTodoById);
todoRoute.post("/", validatePost, todoController.postTodo);
todoRoute.patch("/:id", validateUpdate, todoController.updateTodo);
todoRoute.delete("/:id", validateDelete, todoController.deleteTodo);


module.exports = todoRoute;