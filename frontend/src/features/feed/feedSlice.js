import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedApi } from '../../api/feed.api';
import { upsertPost } from '../post/postSlice';

export const fetchGlobalFeed = createAsyncThunk(
  'feed/fetchGlobal',
  async ({ cursor = null, limit = 15 } = {}, { dispatch, rejectWithValue }) => {
    try {
      const res = await feedApi.getGlobal(cursor, limit);
      const data = res.data.data;
      // Upsert each post into post entities so like updates work everywhere
      data.posts.forEach(post => dispatch(upsertPost(post)));
      return { ...data, cursor };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load feed');
    }
  }
);

export const fetchFollowingFeed = createAsyncThunk(
  'feed/fetchFollowing',
  async ({ cursor = null, limit = 15 } = {}, { dispatch, rejectWithValue }) => {
    try {
      const res = await feedApi.getFollowing(cursor, limit);
      const data = res.data.data;
      // Upsert each post into post entities so like updates work everywhere
      data.posts.forEach(post => dispatch(upsertPost(post)));
      return { ...data, cursor };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load feed');
    }
  }
);

const makeFeedState = () => ({
  postIds: [],
  pagination: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  initialized: false,
});

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    global: makeFeedState(),
    following: makeFeedState(),
  },
  reducers: {
    prependPost: (state, action) => {
      const postId = action.payload;
      if (!state.global.postIds.includes(postId)) state.global.postIds.unshift(postId);
      if (!state.following.postIds.includes(postId)) state.following.postIds.unshift(postId);
    },
    removePost: (state, action) => {
      const postId = action.payload;
      state.global.postIds = state.global.postIds.filter((id) => id !== postId);
      state.following.postIds = state.following.postIds.filter((id) => id !== postId);
    },
    resetGlobalFeed: (state) => { state.global = makeFeedState(); },
    // Always reset following so it re-fetches with latest follow state
    resetFollowingFeed: (state) => { state.following = makeFeedState(); },
  },
  extraReducers: (builder) => {
    // Global feed
    builder
      .addCase(fetchGlobalFeed.pending, (state, action) => {
        const isLoadMore = !!action.meta.arg?.cursor;
        if (isLoadMore) state.global.isLoadingMore = true;
        else { state.global.isLoading = true; state.global.error = null; }
      })
      .addCase(fetchGlobalFeed.fulfilled, (state, action) => {
        const { posts, pagination, cursor } = action.payload;
        const ids = posts.map((p) => p.id);
        if (cursor) {
          const existing = new Set(state.global.postIds);
          state.global.postIds = [...state.global.postIds, ...ids.filter((id) => !existing.has(id))];
        } else {
          state.global.postIds = ids;
        }
        state.global.pagination = pagination;
        state.global.isLoading = false;
        state.global.isLoadingMore = false;
        state.global.initialized = true;
      })
      .addCase(fetchGlobalFeed.rejected, (state, action) => {
        state.global.isLoading = false;
        state.global.isLoadingMore = false;
        state.global.error = action.payload;
      });

    // Following feed
    builder
      .addCase(fetchFollowingFeed.pending, (state, action) => {
        const isLoadMore = !!action.meta.arg?.cursor;
        if (isLoadMore) state.following.isLoadingMore = true;
        else { state.following.isLoading = true; state.following.error = null; }
      })
      .addCase(fetchFollowingFeed.fulfilled, (state, action) => {
        const { posts, pagination, cursor } = action.payload;
        const ids = posts.map((p) => p.id);
        if (cursor) {
          const existing = new Set(state.following.postIds);
          state.following.postIds = [...state.following.postIds, ...ids.filter((id) => !existing.has(id))];
        } else {
          state.following.postIds = ids;
        }
        state.following.pagination = pagination;
        state.following.isLoading = false;
        state.following.isLoadingMore = false;
        state.following.initialized = true;
      })
      .addCase(fetchFollowingFeed.rejected, (state, action) => {
        state.following.isLoading = false;
        state.following.isLoadingMore = false;
        state.following.error = action.payload;
      });
  },
});

export const { prependPost, removePost, resetGlobalFeed, resetFollowingFeed } = feedSlice.actions;

export const selectGlobalFeed = (state) => state.feed.global;
export const selectFollowingFeed = (state) => state.feed.following;

export default feedSlice.reducer;