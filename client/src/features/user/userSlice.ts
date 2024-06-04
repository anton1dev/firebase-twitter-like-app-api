import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '../../interfaces/User';

export interface UserState {
  user: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },

    clear: (state) => {
      state.user = null;
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setUserPhoto: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.photo = action.payload;
      }
    },
  },
});

export default userSlice.reducer;
export const { actions } = userSlice;
