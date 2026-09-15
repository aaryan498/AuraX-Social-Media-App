import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSocket } from '../../socket/socket.js'


const initialState = {
    messages: [],
}

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async({ userId })=>{
    return new Promise((resolve) => {
        getSocket().emit('message:fetch', { to_user_id: userId }, (ack) => {
            resolve(ack.success ? ack : null)
        })
    })
})

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action)=>{
            state.messages = action.payload;
        },
        addMessages: (state, action)=>{
            state.messages = [...state.messages, action.payload];
        },
        resetMessages: (state)=>{
            state.messages = [];
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchMessages.fulfilled, (state, action)=>{
            if(action.payload){
                state.messages = action.payload.messages
            }
        })
    }
})

export const {setMessages, addMessages, resetMessages} = messagesSlice.actions;


export default messagesSlice.reducer