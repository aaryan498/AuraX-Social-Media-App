import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios.js'

const initialState = {
    items: [],
    unreadCount: 0,
}

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (token) => {
    const { data } = await api.get('/api/notification/list', { headers: { Authorization: `Bearer ${token}` } })
    return data.success ? data.notifications : []
})

export const markAllRead = createAsyncThunk('notifications/markAllRead', async (token) => {
    const { data } = await api.post('/api/notification/mark-all-read', {}, { headers: { Authorization: `Bearer ${token}` } })
    return data.success
})

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload)
            state.unreadCount += 1
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.items = action.payload
                state.unreadCount = action.payload.filter(n => !n.read).length
            })
            .addCase(markAllRead.fulfilled, (state, action) => {
                if(action.payload){
                    state.items = state.items.map(n => ({...n, read: true}))
                    state.unreadCount = 0
                }
            })
    }
})

export const { addNotification } = notificationsSlice.actions
export default notificationsSlice.reducer