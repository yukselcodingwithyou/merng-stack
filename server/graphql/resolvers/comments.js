const { AuthenticationError, UserInputError } = require('apollo-server');
const { validateCreateComment } = require('../../utils/validators.js')

const Post = require('../../models/Post');
const authenticate = require('../../utils/authenticator.js')

module.exports = {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const { username } = authenticate(context);

            if (!username) {
                throw new AuthenticationError("Action not allowed.")
            }

            const { errors, invalid } = validateCreateComment(body);
            if (invalid) {
                throw new UserInputError("Errors: ", { errors });
            }

            try {
                let post = await Post.findById(postId);
                if (post) {
                    post.comments.unshift({
                        body,
                        username,
                        createdAt: new Date().toISOString()
                    });

                    const savedPost = await post.save();
                    return savedPost;

                } else {
                    throw new UserInputError(`Post with id ${postId} not found`)
                }
            } catch (err) {
                throw new UserInputError(`Post with id ${postId} not found`)
            }

        },

        async deleteComment(_, { postId, commentId }, context) {
            const { username } = authenticate(context);
            try {
                let post = await Post.findById(postId);
                if (post) {
                    if (username !== post.username) {
                        throw new AuthenticationError("Action not allowed.");
                    }
                    const comments = post.comments.filter(c => c.id !== commentId);
                    post.comments = comments;
                    const savedPost = await post.save()
                    return savedPost;
                } else {
                    throw new UserInputError(`Post with id ${postId} not found`)
                }
            } catch (err) {
                throw new UserInputError(`Post with id ${postId} not found`)
            }
        }
    }
}