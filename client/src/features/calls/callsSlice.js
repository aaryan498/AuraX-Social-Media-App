import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    status: 'idle',       // 'idle' | 'calling' | 'ringing' | 'connected'
    callId: null,
    callType: null,       // 'audio' | 'video'
    remoteUser: null,     // { _id, full_name, username, profile_picture }
    isCaller: false,
    startedAt: null,
}

const callsSlice = createSlice({
    name: 'calls',
    initialState,
    reducers: {
        startOutgoingCall: (state, action) => {
            state.status = 'calling'
            state.remoteUser = action.payload.remoteUser
            state.callType = action.payload.callType
            state.isCaller = true
        },
        setCallId: (state, action) => { state.callId = action.payload },
        receiveIncomingCall: (state, action) => {
            state.status = 'ringing'
            state.callId = action.payload.callId
            state.remoteUser = action.payload.fromUser
            state.callType = action.payload.callType
            state.isCaller = false
        },
        callConnected: (state) => {
            state.status = 'connected'
            state.startedAt = Date.now()
        },
        resetCall: () => initialState,
    }
})

export const { startOutgoingCall, setCallId, receiveIncomingCall, callConnected, resetCall } = callsSlice.actions
export default callsSlice.reducer