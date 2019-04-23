import uuid from 'uuid/v4';

export default {
  createUser(parent, { data }, { db }) {
    const userExists = db.users.some(user => user.email === data.email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const user = {
      id: uuid(),
      ...data
    };

    db.users.push(user);
    return user;
  },

  updateUser(parent, { id, data }, { db }) {
    const user = db.users.find(user => user.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.name) {
      user.name = data.name;
    }
    if (data.age !== 'undefined') {
      user.age = data.age;
    }
    return user;
  },

  deleteUser(parent, { id }, { db }) {
    const userIndex = db.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    db.posts = db.posts.filter(post => {
      const match = post.author === id;
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });

    const deletedUsers = db.users.splice(userIndex, 1);
    return deletedUsers[0];
  },

  createPost(parent, { data }, { db, pubSub }) {
    const userExists = db.users.some(user => user.id === data.author);
    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuid(),
      ...data
    };

    db.posts.push(post);

    if (post.published) {
      pubSub.publish('post', { post });
    }

    return post;
  },

  updatePost(parent, { id, data }, { db }) {
    const post = db.posts.find(post => post.id === id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (data.title) {
      post.title = data.title;
    }
    if (data.body) {
      post.body = data.body;
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published;
    }
    return post;
  },

  deletePost(parent, { id }, { db }) {
    const postIndex = db.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    db.comments = db.comments.filter(comment => comment.post !== id);

    const deletedPosts = db.posts.splice(postIndex, 1);
    return deletedPosts[0];
  },

  createComment(parent, { data }, { db }) {
    const userExists = db.users.some(user => user.id === data.author);
    if (!userExists) {
      throw new Error('User not found');
    }

    const post = db.posts.find(post => post.id === data.post);
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

    db.comments.push(comment);
    return comment;
  },

  updateComment(parent, { id, data }, { db }) {
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (data.text) {
      comment.text = data.text;
    }
    return comment;
  },

  deleteComment(parent, { id }, { db }) {
    const commentIndex = db.comments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const deletedComments = db.comments.splice(commentIndex, 1);
    return deletedComments[0];
  }
};
