import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

let users = [
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

let posts = [
  {
    id: '1',
    title: 'Post 1 of Antonio',
    body: 'Post 1',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'Post 2 of Antonio',
    body: 'Post 2',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'Post 1 of Alice',
    body: 'Post 3',
    published: false,
    author: '3'
  }
];

let comments = [
  {
    id: '1',
    text: 'Comment 1 of Williams in Post 1',
    author: '2',
    post: '1'
  },
  {
    id: '2',
    text: 'Comment 2 of Williams in Post 1',
    author: '2',
    post: '1'
  },
  {
    id: '3',
    text: 'Comment 1 of Antonio in Post 1',
    author: '1',
    post: '1'
  },
  {
    id: '4',
    text: 'Comment 1 of Alice in Post 3',
    author: '3',
    post: '3'
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
    createUser(data: CreateUserInput!): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    deleteComment(id: ID!): Comment!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
    createUser(parent, { data }) {
      const userExists = users.some(user => user.email === data.email);
      if (userExists) {
        throw new Error('User already exists');
      }

      const user = {
        id: uuid(),
        ...data
      };

      users.push(user);
      return user;
    },
    deleteUser(parent, { id }) {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      posts = posts.filter(post => {
        const match = post.author === id;
        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }
        return !match;
      });

      const deletedUsers = users.splice(userIndex, 1);
      return deletedUsers[0];
    },
    deletePost(parent, { id }) {
      const postIndex = posts.findIndex(post => post.id === id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      comments = comments.filter(comment => comment.post !== id);

      const deletedPosts = posts.splice(postIndex, 1);
      return deletedPosts[0];
    },
    deleteComment(parent, { id }) {
      const commentIndex = comments.findIndex(comment => comment.id === id);
      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deletedComments = comments.splice(commentIndex, 1);
      return deletedComments[0];
    },
    createPost(parent, { data }) {
      const userExists = users.some(user => user.id === data.author);
      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuid(),
        ...data
      };

      posts.push(post);
      return post;
    },
    createComment(parent, { data }) {
      const userExists = users.some(user => user.id === data.author);
      if (!userExists) {
        throw new Error('User not found');
      }

      const post = posts.find(post => post.id === data.post);
      if (!post) {
        throw new Error('Post not found');
      }
      if (!post.published) {
        throw new Error('Post is not published');
      }

      const comment = {
        id: uuid(),
        ...data
      };

      comments.push(comment);
      return comment;
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
