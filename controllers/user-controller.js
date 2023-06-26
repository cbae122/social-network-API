const { User, Thought } = require('../models');

const userController = {
    async getUser(req, res) {
        try {
            const userDataDB = await User.find()
                .select('-__v')

            res.join(userDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getSingleUser(req, res) {
        try {
            const userDataDB = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('friends')
                .populate('thoughts');

            if (!userDataDB) {
                return res.status(404).json({ message: 'No user with this id! ' });
            }

            res.join(userDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const userDataDB = await User.create(req.body)
            res.json(userDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const userDataDB = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!userDataDB) {
                res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(userDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const userDataDB = await User.findOneAndDelete({ _id: req.params.userId });

            if (!userDataDB) {
                res.status(404).json({ message: 'No user with this id!' });
            }

            await Thought.deleteMany({ _id: { $in: userDataDB.thoughts } });
            res.json({ message: 'User and Thoughts deleted!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const userDataDB = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );

            if (!userDataDB) {
                res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(userDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async removeFriend(req, res) {
        try {
            const userDataDB = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );

            if (!userDataDB) {
                res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(userDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
};

module.exports = userController;