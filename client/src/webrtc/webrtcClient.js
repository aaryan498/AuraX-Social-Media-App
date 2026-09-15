import api from '../api/axios.js'

let peerConnection = null
let localStream = null
let pendingCandidates = []
let remoteDescriptionSet = false

export const fetchIceServers = async (token) => {
    const { data } = await api.get('/api/user/ice-servers', { headers: { Authorization: `Bearer ${token}` } })
    return data.success ? data.iceServers : [{ urls: 'stun:stun.l.google.com:19302' }]
}

export const getLocalMedia = async (callType) => {
    if(localStream) return localStream
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: callType === 'video' })
    return localStream
}

export const createPeerConnection = (iceServers, { onIceCandidate, onTrack, onConnectionStateChange }) => {
    peerConnection = new RTCPeerConnection({ iceServers })
    if(localStream){
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream))
    }
    peerConnection.onicecandidate = (event) => { if(event.candidate) onIceCandidate(event.candidate) }
    peerConnection.ontrack = (event) => onTrack(event.streams[0])
    peerConnection.onconnectionstatechange = () => onConnectionStateChange(peerConnection.connectionState)
    remoteDescriptionSet = false
    pendingCandidates = []
    return peerConnection
}

export const createOffer = async () => {
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    return offer
}

export const createAnswer = async (remoteSdp) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteSdp))
    remoteDescriptionSet = true
    await flushPendingCandidates()
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    return answer
}

export const applyAnswer = async (remoteSdp) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteSdp))
    remoteDescriptionSet = true
    await flushPendingCandidates()
}

export const addIceCandidate = async (candidate) => {
    if(!remoteDescriptionSet){
        pendingCandidates.push(candidate)
        return
    }
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
}

const flushPendingCandidates = async () => {
    for(const candidate of pendingCandidates){
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    }
    pendingCandidates = []
}

export const toggleMic = (enabled) => {
    localStream?.getAudioTracks().forEach(track => { track.enabled = enabled })
}

export const toggleCamera = (enabled) => {
    localStream?.getVideoTracks().forEach(track => { track.enabled = enabled })
}

export const getLocalStream = () => localStream

export const teardownCall = () => {
    localStream?.getTracks().forEach(track => track.stop())
    localStream = null
    peerConnection?.close()
    peerConnection = null
    pendingCandidates = []
    remoteDescriptionSet = false
}