const router = require("express").Router();
const { checkToken, isAdmin } = require("../middleware/auth");
const { createUser, getUsers, getUser, updateUser, deleteUser, getUserSubscription } = require("../middleware/users")

// create user
router.post("/", createUser);

// get all users
router.get("/", checkToken, isAdmin, getUsers);

// get user by id
router.get("/:id", checkToken, isAdmin, getUser);

// update user by id
router.put("/:id", checkToken, isAdmin, updateUser);

// delete user by id
router.delete("/:id", checkToken, isAdmin, deleteUser);

//get the subscription accossiated with the user
router.get("/subscription", checkToken, getUserSubscription);

module.exports = router;