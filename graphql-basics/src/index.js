import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  type Query {
    me: User!
    post: Post!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        id: '1234',
        name: 'Antonio Gil',
        email: 'antonio.gil@aswecode.com'
      };
    },
    post() {
      return {
        id: '4321',
        title: 'The post title',
        body: 'The content body',
        published: true
      };
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('Server is running in http://localhost:4000');
});
