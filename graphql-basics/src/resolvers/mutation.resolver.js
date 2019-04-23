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
      pubSub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }

    return post;
  },

  updatePost(parent, { id, data }, { db, pubSub }) {
    const post = db.posts.find(post => post.id === id);
    if (!post) {
      throw new Error('Post not found');
    }
    const originalPost = { ...post };

    if (data.title) {
      post.title = data.title;
    }
    if (data.body) {
      post.body = data.body;
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubSub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubSub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      pubSub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }
    return post;
  },

  deletePost(parent, { id }, { db, pubSub }) {
    const postIndex = db.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    db.comments = db.comments.filter(comment => comment.post !== id);

    const [post] = db.posts.splice(postIndex, 1);

    pubSub.publish('post', {
      post: {
        mutation: 'DELETED',
        data: post
      }
    });

    return post;
  },

  createComment(parent, { data }, { db, pubSub }) {
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

    pubSub.publish(`post ${post.id}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });
    return comment;
  },

  updateComment(parent, { id, data }, { db, pubSub }) {
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (data.text) {
      comment.text = data.text;
    }

    pubSub.publish(`post ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });

    return comment;
  },

  deleteComment(parent, { id }, { db, pubSub }) {
    const commentIndex = db.comments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubSub.publish(`post ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    });

    return deletedComment;
  }
};
