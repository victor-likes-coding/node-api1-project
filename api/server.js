// BUILD YOUR SERVER HERE
const express = require("express");

const { find, findById, insert, remove, update } = require("./users/model");

const server = express();

server.use(express.json());

// need the following
// * post /api/users
// * get /api/users
// * get /api/users/:id
// delete /api/users/:id
// put /api/users/:id

// get users

server.get("/api/users", async (req, res) => {
    try {
        const results = await find();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: "The users information could not be retrieved" });
    }
});

// get user by id
server.get("/api/users/:id", async (req, res) => {
    try {
        const results = await findById(req.params.id);
        if (results) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist" });
        }
    } catch (err) {
        res.status(500).json({ message: "The user information could not be retrieved" });
    }
});

// post user
server.post("/api/users", async (req, res) => {
    // if missing name or bio send 400 status code
    const { name, bio } = req.body;
    if (!name || !bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        try {
            const results = await insert({ name, bio });
            if (results) {
                res.status(201).json(results);
            } else {
                res.status(400).json({ message: "Please provide name and bio for the user" });
            }
        } catch (err) {
            res.status(500).json({ message: "There was an error while saving the user to the database" });
        }
    }
});

// delete user
server.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const results = await findById(id);
        if (results) {
            const deleted = await remove(id);
            if (deleted) {
                res.status(200).json(results);
            } else {
                res.status(500).json({ message: "The user could not be removed" });
            }
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist" });
        }
    } catch (err) {
        res.status(500).json({ message: "The user could not be removed" });
    }
});

// update user
server.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;

    if (!name || !bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        try {
            const results = await findById(id);
            if (results) {
                const updated = await update(id, { name, bio });
                if (updated) {
                    res.status(200).json(updated);
                } else {
                    res.status(500).json({ message: "The user information could not be modified" });
                }
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            }
        } catch (err) {
            res.status(500).json({ message: "The user information could not be modified" });
        }
    }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
