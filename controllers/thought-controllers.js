const { Thought, User } = require('../models');

const thoughtController = {
    async getThoughts(req, res) {
        try {
            const thoughtDataDB = await Thought.find()
                .sort({ createdAt: -1 })

            res.json(thoughtDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thoughtDataDB = await Thought.findOne({ _id: req.params.thoughtId })

            if (!thoughtDataDB) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thoughtDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const thoughtDataDB = await Thought.create(req.body)
            const userDataDB = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { thoughts: createThought._id} },
                { new: true }
            );
            if (!userDataDB) {
                return res.status(404).json({ message: 'Thought created but no user with this id!' });
            }
            res.json({ message: 'Thought has been created!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thoughtDataDB = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thoughtDataDB) {
                res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thoughtDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thoughtDataDB = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

            if (!thoughtDataDB) {
                res.status(404).json({ message: 'No thought with this id!' });
            }

            const userDataDB = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
                );

                if (!userDataDB) {
                    return res.status(404).json({ message: 'Thought created but no user with this id!' });
                }
            res.json({ message: 'Thought has been deleted!' });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async addReaction(req, res) {
        try {
            const thoughtDataDB = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thoughtDataDB) {
                res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thoughtDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async removeReaction(req, res) {
        try {
            const thoughtDataDB = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thoughtDataDB) {
                res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thoughtDataDB);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
};

module.exports = thoughtController;