import { createSlice } from "@reduxjs/toolkit";
// import { Room } from '../../../web-api-client';

export const roomSlice = createSlice({
    name: "room",
    initialState: {
        roomInfo: {
            clientId: "",
            id: 0,
            money: 0,
            name: "",
            personnelSituation: 0,
            powerSupply: 0,
            state: 0,
        },
    },
    reducers: {
        changer_room: (state, action) => {
            state.roomInfo = action.payload;
        },
    },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { changer_room } = roomSlice.actions;

export default roomSlice.reducer;