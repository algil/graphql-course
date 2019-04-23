export default {
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

  users(parent, args, { db }) {
    return db.users;
  },

  posts(parent, { query }, { db }) {
    if (!query) {
      return db.posts;
    }

    return db.posts.filter(({ title, body }) => {
      return (
        title.toLowerCase().includes(query.toLowerCase()) ||
        body.toLowerCase().includes(query.toLowerCase())
      );
    });
  },

  comments(parent, args, { db }) {
    return db.comments;
  }
};
