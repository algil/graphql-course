import { GraphQLServer } from 'graphql-yoga';

const posts = [
  {
    id: '1',
    title: 'Megalodon',
    body: 'A very big shark in the sea',
    published: true
  },
  {
    title: '2',
    title: 'Aquaman',
    body: 'The king of the sea and oceans',
    published: true
  },
  {
    id: '3',
    title: 'Avengers Infinity War',
    body: 'The best Marvel heroes fighting against the evil Thanos',
    published: false
  }
];

const typeDefs = `
  type Query {
    me: User!
    post: Post!
    posts(query: String): [Post!]!
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
    },
    posts(parent, args) {
      if (!args.query) {
        return posts;
      }

      let query = args.query.toLowerCase();
      return posts.filter(({ title, body }) => {
        return (
          title.toLowerCase().includes(query) ||
          body.toLowerCase().includes(query)
        );
      });
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
