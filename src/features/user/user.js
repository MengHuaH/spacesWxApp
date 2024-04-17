import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: {
            phoneNumber: '',
            nickName: '',
            avatarUrl: '',
            money:0
        },
    },
    reducers: {
        changer_user: (state, action) => {
            state.userInfo = action.payload;
        },
    },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { changer_user } = userSlice.actions;

export default userSlice.reducer;