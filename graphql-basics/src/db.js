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

const comments = [
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

export default {
  users,
  posts,
  comments
};
