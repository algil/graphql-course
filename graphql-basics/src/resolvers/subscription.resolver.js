export default {
  post: {
    subscribe(parent, args, { pubSub }) {
      return pubSub.asyncIterator('post');
    }
  },
  comment: {
    subscribe(parent, { postId }, { db, pubSub }) {
      const post = db.posts.find(post => post.id === postId && post.published);
      if (!post) {
        throw new Error('Post not found');
      }
      return pubSub.asyncIterator(`post ${postId}`);
    }
  }
};
