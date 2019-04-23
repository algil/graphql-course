export default {
  post: {
    subscribe(parent, args, { pubSub }) {
      return pubSub.asyncIterator('post');
    }
  }
};
