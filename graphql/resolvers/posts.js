const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const authenticate = require('../../utils/authenticator.js')

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (!post) {
                    throw new UserInputError(`Post not found with id ${postId}`)
                }
                return post;
            } catch (err) {
                throw new UserInputError(`Post not found with id ${postId}`)
            }
        }

    },

    Mutation: {
        async createPost(_, { body }, context) {
            const user = authenticate(context);

            const newPost = new Post({
                username: user.username,
                body: body,
                email: user.email,
                createdAt: new Date().toISOString(),
                user: user.id,
            });

            const savedPost = await newPost.save();
            return savedPost;
        },

        async deletePost(_, { postId }, context) {
            const user = authenticate(context);

            try {
                const post = await Post.findById(postId);

                if (post.username === user.username) {
                    await post.delete();
                    return "OK";
                } else {
                    throw new AuthenticationError("Delete action not allowed!");
                }
            } catch (err) {
                throw new UserInputError(`Post not found with id ${postId}`)
            }

        }
    }
}