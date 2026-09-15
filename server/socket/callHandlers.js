import crypto from 'crypto'
import Call from '../models/callModel.js'
import User from '../models/userModel.js'

const activeCalls = new Map()      // callId -> { callerUserId, receiverUserId, callType, status, startedAt }
const userActiveCallId = new Map() // userId -> callId

export const registerCallHandlers = (io, socket) => {

    // Writes the final outcome of a call to the DB and cleans up in-memory state.
    // Guarded so it can never wipe out bookkeeping belonging to a different, still-ongoing call.
    const finalizeCall = async (callId, status) => {
        const call = activeCalls.get(callId)
        if(!call) return

        try {
            await Call.create({
                caller: call.callerUserId,
                receiver: call.receiverUserId,
                call_type: call.callType,
                status,
                started_at: call.startedAt || undefined,
                ended_at: new Date()
            })
        } catch (error) {
            console.log(error)
        }

        activeCalls.delete(callId)

        if(userActiveCallId.get(call.callerUserId) === callId){
            userActiveCallId.delete(call.callerUserId)
        }
        if(userActiveCallId.get(call.receiverUserId) === callId){
            userActiveCallId.delete(call.receiverUserId)
        }
    }

    socket.on('call:invite', async ({ to_user_id, call_type }, ack) => {
        try {

            const user = await User.findById(socket.userId)

            if(!user.connections.includes(to_user_id)){
                return ack({ success: false, message: "You can only call your connections" })
            }

            const callId = crypto.randomUUID()

            activeCalls.set(callId, {
                callerUserId: socket.userId,
                receiverUserId: to_user_id,
                callType: call_type,
                status: 'ringing',
                startedAt: null
            })

            // Only claim bookkeeping for a party if they aren't already tracked in a separate
            // ongoing call — busy handling is entirely client-side (Phase 5); this guard exists
            // purely to protect the map from being corrupted, never to block the invite.
            if(!userActiveCallId.has(socket.userId)) userActiveCallId.set(socket.userId, callId)
            if(!userActiveCallId.has(to_user_id)) userActiveCallId.set(to_user_id, callId)

            io.to(to_user_id).emit('call:incoming', { callId, from_user: user, call_type })

            ack({ success: true, callId })

        } catch (error) {
            console.log(error)
            ack({ success: false, message: error.message })
        }
    })

    socket.on('call:accept', ({ callId }) => {
        const call = activeCalls.get(callId)
        if(!call || call.status !== 'ringing') return

        call.status = 'active'
        call.startedAt = new Date()

        io.to(call.callerUserId).emit('call:accepted', { callId })
        io.to(call.receiverUserId).emit('call:resolved-elsewhere', { callId, resolvingSocketId: socket.id })
    })

    socket.on('call:reject', async ({ callId }) => {
        const call = activeCalls.get(callId)
        if(!call || call.status !== 'ringing') return

        io.to(call.callerUserId).emit('call:rejected', { callId })
        io.to(call.receiverUserId).emit('call:resolved-elsewhere', { callId, resolvingSocketId: socket.id })

        await finalizeCall(callId, 'rejected')
    })

    socket.on('call:cancel', async ({ callId }) => {
        const call = activeCalls.get(callId)
        if(!call || call.status !== 'ringing') return

        io.to(call.receiverUserId).emit('call:cancelled', { callId })

        await finalizeCall(callId, 'missed')
    })

    socket.on('call:end', async ({ callId }) => {
        const call = activeCalls.get(callId)
        if(!call) return

        const otherParty = call.callerUserId === socket.userId ? call.receiverUserId : call.callerUserId
        io.to(otherParty).emit('call:ended', { callId })

        if(call.status === 'active'){
            await finalizeCall(callId, 'completed')
        } else{
            await finalizeCall(callId, 'missed')
        }
    })

    // Pure SDP/ICE relay — no map interaction, no DB writes
    socket.on('call:offer', ({ callId, to_user_id, sdp }) => {
        io.to(to_user_id).emit('call:offer', { callId, sdp, from_user_id: socket.userId })
    })

    socket.on('call:answer', ({ callId, to_user_id, sdp }) => {
        io.to(to_user_id).emit('call:answer', { callId, sdp, from_user_id: socket.userId })
    })

    socket.on('call:ice-candidate', ({ callId, to_user_id, candidate }) => {
        io.to(to_user_id).emit('call:ice-candidate', { callId, candidate, from_user_id: socket.userId })
    })

    // Disconnect-during-call safety net — independent of the disconnect listener in socket/index.js
    socket.on('disconnect', async () => {
        const callId = userActiveCallId.get(socket.userId)
        if(!callId) return
        const call = activeCalls.get(callId)
        if(!call) return
        const otherParty = call.callerUserId === socket.userId ? call.receiverUserId : call.callerUserId
        io.to(otherParty).emit('call:ended', { callId })
        await finalizeCall(callId, call.status === 'active' ? 'completed' : 'missed')
    })

}