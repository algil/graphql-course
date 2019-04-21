import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

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
    id: '2',
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

const comments = [
  {
    id: '1',
    text: 'A fabulous comment',
    author: '2',
    post: '1'
  },
  {
    id: '2',
    text: 'This is the second comment',
    author: '2',
    post: '1'
  },
  {
    id: '3',
    text: 'Another bored comment',
    author: '1',
    post: '1'
  },
  {
    id: '4',
    text: 'And finally the las comment',
    author: '3',
    post: '2'
  }
];

const typeDefs = `
  type Query {
    me: User!
    post: Post!
    users: [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }
  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]
  }
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    },
    comments() {
      return comments;
    }
  },
  Mutation: {
    createUser(parent, args) {
      const userExists = users.some(user => user.email === args.email);
      if (userExists) {
        throw new Error('User already exists');
      }

      const user = {
        id: uuid(),
        name: args.name,
        email: args.email,
        age: args.age
      };

      users.push(user);

      return user;
    }
  },
  Post: {
    author(parent) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent) {
      return comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent) {
      return users.find(user => user.id === parent.author);
    },
    post(parent) {
      return posts.find(post => post.id === parent.post);
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
