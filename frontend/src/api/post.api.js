import client from './client';

export const postApi = {
  create: (formData) =>
    client.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getById: (id) => client.get(`/posts/${id}`),
  update: (id, data) => client.patch(`/posts/${id}`, data),
  delete: (id) => client.delete(`/posts/${id}`),
  like: (id) => client.post(`/posts/${id}/like`),
  unlike: (id) => client.delete(`/posts/${id}/like`),
};