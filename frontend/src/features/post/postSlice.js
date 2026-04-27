import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postApi } from '../../api/post.api';
import { commentApi } from '../../api/comment.api';

export const createPost = createAsyncThunk('post/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await postApi.create(formData);
    return res.data.data.post;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post');
  }
});

export const deletePost = createAsyncThunk('post/delete', async (id, { rejectWithValue }) => {
  try {
    await postApi.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete post');
  }
});

export const likePost = createAsyncThunk('post/like', async (id, { rejectWithValue }) => {
  try {
    await postApi.like(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const unlikePost = createAsyncThunk('post/unlike', async (id, { rejectWithValue }) => {
  try {
    await postApi.unlike(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addComment = createAsyncThunk('post/addComment', async ({ postId, content }, { rejectWithValue }) => {
  try {
    const res = await commentApi.add(postId, content);
    return { postId, comment: res.data.data.comment };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add comment');
  }
});

export const fetchComments = createAsyncThunk('post/fetchComments', async ({ postId, cursor }, { rejectWithValue }) => {
  try {
    const res = await commentApi.getAll(postId, cursor, 20);
    return { postId, ...res.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteComment = createAsyncThunk('post/deleteComment', async ({ postId, commentId }, { rejectWithValue }) => {
  try {
    await commentApi.delete(postId, commentId);
    return { postId, commentId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// Helper: apply optimistic like toggle on a post object
const applyLike = (post, userId) => ({
  ...post,
  isLiked: true,
  likesCount: post.likesCount + 1,
});
const applyUnlike = (post, userId) => ({
  ...post,
  isLiked: false,
  likesCount: Math.max(0, post.likesCount - 1),
});

const postSlice = createSlice({
  name: 'post',
  initialState: {
    entities: {},        // postId -> post
    comments: {},        // postId -> { items, pagination, isLoading }
    isCreating: false,
    error: null,
  },
  reducers: {
    upsertPost: (state, action) => {
      state.entities[action.payload.id] = action.payload;
    },
    // Optimistic like
    optimisticLike: (state, action) => {
      const post = state.entities[action.payload];
      if (post) { post.isLiked = true; post.likesCount += 1; }
    },
    optimisticUnlike: (state, action) => {
      const post = state.entities[action.payload];
      if (post) { post.isLiked = false; post.likesCount = Math.max(0, post.likesCount - 1); }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => { state.isCreating = true; state.error = null; })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreating = false;
        state.entities[action.payload.id] = action.payload;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      });

    builder.addCase(deletePost.fulfilled, (state, action) => {
      delete state.entities[action.payload];
    });

    // Like/unlike — optimistic in feed slice, reflect here
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.entities[action.payload];
        if (post) { post.isLiked = true; post.likesCount += 1; }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.entities[action.payload];
        if (post) { post.isLiked = false; post.likesCount = Math.max(0, post.likesCount - 1); }
      });

    builder
      .addCase(fetchComments.pending, (state, action) => {
        const postId = action.meta.arg.postId;
        if (!state.comments[postId]) state.comments[postId] = { items: [], pagination: null, isLoading: true };
        else state.comments[postId].isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments, pagination } = action.payload;
        const existing = state.comments[postId]?.items || [];
        const newIds = new Set(existing.map((c) => c.id));
        const merged = [...existing, ...comments.filter((c) => !newIds.has(c.id))];
        state.comments[postId] = { items: merged, pagination, isLoading: false };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const postId = action.meta.arg.postId;
        if (state.comments[postId]) state.comments[postId].isLoading = false;
      });

    builder
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.comments[postId]) state.comments[postId] = { items: [], pagination: null, isLoading: false };
        state.comments[postId].items.push(comment);
        if (state.entities[postId]) state.entities[postId].commentsCount += 1;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        if (state.comments[postId]) {
          state.comments[postId].items = state.comments[postId].items.filter((c) => c.id !== commentId);
        }
        if (state.entities[postId]) state.entities[postId].commentsCount = Math.max(0, state.entities[postId].commentsCount - 1);
      });
  },
});

export const { upsertPost, optimisticLike, optimisticUnlike } = postSlice.actions;

export const selectPost = (id) => (state) => state.post.entities[id];
export const selectComments = (postId) => (state) => state.post.comments[postId];
export const selectIsCreating = (state) => state.post.isCreating;

export default postSlice.reducer;