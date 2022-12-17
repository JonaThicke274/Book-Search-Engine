const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id})
                    .select('-__v -password')
                    .populate('savedBooks')
                return userData;
            }
        }
    },
    Mutation: {
        addUser: async(parents, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async(parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials!');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const userSavedBook = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: args }},
                    { new: true }
                )
                return userSavedBook;
            }
        },
        deleteBook: async (parent, args, context) => {
            if (context.user) {
                const userDeletedBook = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } }},
                    { new: true }
                );
                return userDeletedBook;
            }
        }
    }
};

module.exports = resolvers;