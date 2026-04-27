import client from './client';

export const userApi = {
  search: (q, limit = 10) => client.get('/users/search', { params: { q, limit } }),
  getSuggested: (limit = 10) => client.get('/users/me/suggested', { params: { limit } }),
  getProfile: (username) => client.get(`/users/${username}`),
  updateProfile: (data) => client.patch('/users/me/profile', data),
  uploadAvatar: (formData) =>
    client.post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getFollowers: (username, cursor, limit) =>
    client.get(`/users/${username}/followers`, { params: { cursor, limit } }),
  getFollowing: (username, cursor, limit) =>
    client.get(`/users/${username}/following`, { params: { cursor, limit } }),
  getUserPosts: (username, cursor, limit) =>
    client.get(`/users/${username}/posts`, { params: { cursor, limit } }),
  follow: (username) => client.post(`/users/${username}/follow`),
  unfollow: (username) => client.delete(`/users/${username}/follow`),
};