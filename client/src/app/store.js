import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'
import messagesReducer from '../features/messages/messagesSlice.js'
import connectionsReducer from '../features/connections/connectionsSlice.js'
import presenceReducer from '../features/presence/presenceSlice.js'
import callsReducer from '../features/calls/callsSlice.js'

export const store = configureStore({
    reducer: {
        user: userReducer,
        messages: messagesReducer,
        connections: connectionsReducer,
        presence: presenceReducer,
        calls: callsReducer,
    }
})