import client from './client';

export const commentApi = {
  add: (postId, content) => client.post(`/posts/${postId}/comments`, { content }),
  getAll: (postId, cursor, limit) =>
    client.get(`/posts/${postId}/comments`, { params: { cursor, limit } }),
  delete: (postId, commentId) => client.delete(`/posts/${postId}/comments/${commentId}`),
};