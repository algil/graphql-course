import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

const resolvers = {
  Query: {
    hello() {
      return 'This is my first query';
    },
    name() {
      return 'Antonio Gil';
    },
    location() {
      return 'Málaga (Spain)';
    },
    bio() {
      return 'Music lover and guitar player on Zoonámbulos band';
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
