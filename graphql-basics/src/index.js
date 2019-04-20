import { GraphQLServer } from 'graphql-yoga';

const users = [
  {
    id: '1',
    name: 'Antonio',
    email: 'antonio@example.com',
    age: 36
  },
  {
    id: '2',
    name: 'Williams',
    email: 'williams@example.com'
  },
  {
    id: '3',
    name: 'Alice',
    email: 'alice@example.com',
    age: 39
  }
];

const posts = [
  {
    id: '1',
    title: 'Megalodon',
    body: 'A very big shark in the sea',
    published: true,
    author: '1'
  },
  {
    title: '2',
    title: 'Aquaman',
    body: 'The king of the sea and oceans',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'Avengers Infinity War',
    body: 'The best Marvel heroes fighting against the evil Thanos',
    published: false,
    author: '3'
  }
];

const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users: [User!]!
    posts(query: String): [Post!]!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
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
    users() {
      return users;
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
  },
  Post: {
    author(parent) {
      return users.find(user => user.id === parent.author);
    }
  },
  User: {
    posts(parent) {
      return posts.filter(post => post.author === parent.id);
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
