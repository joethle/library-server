const adminAuth = require("../middleware/admin.middleware");
const router = require('express').Router();
const { User } = require("../models/index.model");
const encrypt = require('password-hash');

// GET REQUEST => GET
router.get('/', async (req, res) => {
    const users = await User.findAll();

    res.statusCode = 201;
    res.json(users);
})

// GET REQUEST => GET[INDEX]
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ where: { user_id: id } });

    if (user === null) {
        res.status(404);
        res.json({
            message: `No user with id ${id} was found.`,
        });
        return;
    }

    res.status(201);
    res.json(user);
})

// POST REQUEST => CREATE
router.post('/', adminAuth, async (req, res) => {
    const _user = req.body;
    _user.password = encrypt.generate(_user.password);
    try {
        const user = await User.create(_user);
        res.status(201);
        res.json({ message: `User with id ${user.user_id} has been created.`, user });
    } catch (err) {
        res.status(400);
        res.send(`there is a problem creating new user.\n${err}`);
    }
})

// PUT REQUEST => UPDATE
router.put('/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ where: { user_id: id } });

    if (user === null) {
        res.status(404);
        res.json({
            message: `No user with id ${id} was found.`,
        });
        return;
    }

    try {
        const _user = req.body;
        if (_user.password) _user.password = encrypt.generate(_user.password);
        
        await User.update(
            { ..._user },
            {
                where: {
                    user_id: id,
                },
            }
        );
        res.status(201);
        res.json({ message: `User with id ${id} has been updated.` });
    } catch (err) {
        res.status(400);
        res.send(`there is a problem updating user of id ${id}.\n${err}`);
    }
})

// DELETE REQUEST => DELETE
router.delete('/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ where: { user_id: id } });

    if (user === null) {
        res.status(404);
        res.json({
            message: `No user with id ${id} was found.`,
        });
        return;
    }

    await User.destroy({ where: { user_id: id, } });

    res.status(201);
    res.json({ message: `User with id ${id} has been removed.` });
})

module.exports = router;