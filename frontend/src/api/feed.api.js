import client from './client';

export const feedApi = {
  getGlobal: (cursor, limit) => client.get('/feed/global', { params: { cursor, limit } }),
  getFollowing: (cursor, limit) => client.get('/feed/following', { params: { cursor, limit } }),
};