import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import resolvers from './resolvers';

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
    pubSub
  }
});

server.start(() => {
  console.log('Server is running in http://localhost:4000');
});
