import { createSlice } from '@reduxjs/toolkit'

const initialState = { onlineUserIds: [] }

const presenceSlice = createSlice({
    name: 'presence',
    initialState,
    reducers: {
        setSnapshot: (state, action) => { state.onlineUserIds = action.payload },
        userOnline: (state, action) => {
            if(!state.onlineUserIds.includes(action.payload)) state.onlineUserIds.push(action.payload)
        },
        userOffline: (state, action) => {
            state.onlineUserIds = state.onlineUserIds.filter(id => id !== action.payload)
        },
    }
})

export const { setSnapshot, userOnline, userOffline } = presenceSlice.actions
export default presenceSlice.reducer