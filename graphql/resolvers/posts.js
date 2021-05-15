const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post.js');
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
            context.pubsub.publish('NEW_POST', { newPost: savedPost });
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

        },

        async likePost(_, { postId }, context) {
            const { username } = authenticate(context);

            try {
                const post = await Post.findById(postId);
                if (post.username !== username) {
                    if (post.likes.find(like => like.username === username)) {
                        post.likes = post.likes.filter(like => like.username !== username);
                    } else {
                        post.likes.push({
                            username: username,
                            createdAt: new Date().toISOString()
                        })
                    }
                } else {
                    throw new UserInputError("User cannot like his/her own post");
                }
                const savedPost = await post.save();
                return savedPost;
            } catch (err) {
                throw new UserInputError(err)
            }
        }
    },

    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}