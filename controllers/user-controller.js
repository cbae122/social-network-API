const { User, Thought } = require('../models');

const userController = {
    async getUser(req, res) {
        try {
            const userDataDB = await User.find()
            .select('-__v')

            res.join(userDataDB);
        }   catch (err) {
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

            if(!userDataDB) {
                return res.status(404).json({ message: 'No user with this id! '});
            }

            res.join(userDataDB);
        }   catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
}