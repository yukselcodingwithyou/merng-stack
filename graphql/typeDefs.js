const gql = require('graphql-tag');

module.exports = gql `
type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
}

type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
}

type User {
    id: ID!
    username: String!
    email: String!
    token: String!
}

input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
}

type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
}

type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: String!, commentId: String!): Post!
}
`