import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '../../interfaces/User';

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    clear: (state) => {
      state.user = null;
    },
  },
});

export default userSlice.reducer;
export const { actions } = userSlice;
