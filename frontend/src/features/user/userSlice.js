import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/user.api';

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (username, { rejectWithValue }) => {
  try {
    const res = await userApi.getProfile(username);
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load profile');
  }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await userApi.updateProfile(data);
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const followUser = createAsyncThunk('user/follow', async (username, { rejectWithValue }) => {
  try {
    await userApi.follow(username);
    return username;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Follow failed');
  }
});

export const unfollowUser = createAsyncThunk('user/unfollow', async (username, { rejectWithValue }) => {
  try {
    await userApi.unfollow(username);
    return username;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Unfollow failed');
  }
});

export const searchUsers = createAsyncThunk('user/search', async (q, { rejectWithValue }) => {
  try {
    const res = await userApi.search(q);
    return res.data.data.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Search failed');
  }
});

export const fetchSuggestedUsers = createAsyncThunk('user/suggested', async (_, { rejectWithValue }) => {
  try {
    const res = await userApi.getSuggested();
    return res.data.data.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load suggestions');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profiles: {},
    searchResults: [],
    suggestedUsers: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => { state.searchResults = []; },
    updateProfileInStore: (state, action) => {
      const u = action.payload;
      if (state.profiles[u.username]) {
        state.profiles[u.username] = { ...state.profiles[u.username], ...u };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles[action.payload.username] = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.profiles[action.payload.username] = action.payload;
    });

    builder
      .addCase(followUser.fulfilled, (state, action) => {
        const username = action.payload;
        if (state.profiles[username]) {
          state.profiles[username].isFollowing = true;
          state.profiles[username].followersCount = (state.profiles[username].followersCount || 0) + 1;
        }
        // Remove from suggested
        state.suggestedUsers = state.suggestedUsers.filter(u => u.username !== username);
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const username = action.payload;
        if (state.profiles[username]) {
          state.profiles[username].isFollowing = false;
          state.profiles[username].followersCount = Math.max(0, (state.profiles[username].followersCount || 1) - 1);
        }
      });

    builder
      .addCase(searchUsers.pending, (state) => { state.isLoading = true; })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state) => { state.isLoading = false; });

    builder
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedUsers = action.payload;
      });
  },
});

export const { clearSearch, updateProfileInStore } = userSlice.actions;

export const selectProfile = (username) => (state) => state.user.profiles[username];
export const selectSearchResults = (state) => state.user.searchResults;
export const selectSuggestedUsers = (state) => state.user.suggestedUsers;
export const selectUserLoading = (state) => state.user.isLoading;

export default userSlice.reducer;