import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserType } from '../../types/UserType';

export interface UserState {
  user: UserType | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },

    clear: (state) => {
      state.user = null;
    },
  },
});

export default userSlice.reducer;
export const { actions } = userSlice;
