const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const { MONGO_CONNECTION_STRING } = require('./config.js')


const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }), // pass the request for authentication
    debug: false, // include or omit stacktracex
});

mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo connection success!")
        return server.listen({ port: 5054 });
    }).then(res => {
        console.log(`Server running at ${res.url}`);
    });