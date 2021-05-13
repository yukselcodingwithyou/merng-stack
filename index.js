const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');


const Post = require('./models/Post')
const User = require('./models/User')
const { MONGO_CONNECTION_STRING } = require('./config.js')

const typeDefs = gql `
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }

    type Query {
        sayHello: String!
        getPosts: [Post]
    }
`

const resolvers = {
    Query: {
        sayHello: () => "Hello, World!",
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo connection success!")
        return server.listen({ port: 5054 });
    }).then(res => {
        console.log(`Server running at ${res.url}`);
    });