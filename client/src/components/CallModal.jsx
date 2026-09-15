import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { getSocket } from '../socket/socket.js'
import { receiveIncomingCall, callConnected, resetCall } from '../features/calls/callsSlice.js'
import {
  fetchIceServers,
  getLocalMedia,
  createPeerConnection,
  createOffer,
  createAnswer,
  applyAnswer,
  addIceCandidate,
  toggleMic,
  toggleCamera,
  getLocalStream,
  teardownCall,
} from '../webrtc/webrtcClient.js'

const CallModal = () => {

  const call = useSelector((state) => state.calls)
  const currentUser = useSelector((state) => state.user.value)
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const [remoteStream, setRemoteStream] = useState(null)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [callDuration, setCallDuration] = useState('00:00')

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const remoteAudioRef = useRef(null)
  const acceptingRef = useRef(false)

  // Mirrors current call state for the mount-once socket effect below
  const callRef = useRef(call)
  useEffect(() => { callRef.current = call }, [call])

  // Reset the accept re-entrancy guard whenever a fresh incoming call arrives
  useEffect(() => {
    if(call.status === 'ringing'){
      acceptingRef.current = false
    }
  }, [call.status, call.callId])

  // Reset local UI state whenever a call fully ends
  useEffect(() => {
    if(call.status === 'idle'){
      setRemoteStream(null)
      setIsMicOn(true)
      setIsCameraOn(true)
      setCallDuration('00:00')
    }
  }, [call.status])

  // ---- All call:* socket listeners — registered once, never torn down while logged in ----
  useEffect(() => {
    const socket = getSocket()

    const sameCall = (payload) => !callRef.current.callId || payload.callId === callRef.current.callId

    const handleIncoming = ({ callId, from_user, call_type }) => {
      if(callRef.current.status !== 'idle'){
        getSocket().emit('call:reject', { callId })
        return
      }
      dispatch(receiveIncomingCall({ callId, fromUser: from_user, callType: call_type }))
    }

    const handleAccepted = async (payload) => {
      if(callRef.current.status !== 'calling' || !sameCall(payload)) return
      try {
        const token = await getToken()
        const iceServers = await fetchIceServers(token)
        await getLocalMedia(callRef.current.callType)

        createPeerConnection(iceServers, {
          onIceCandidate: (candidate) => {
            getSocket().emit('call:ice-candidate', { callId: callRef.current.callId, to_user_id: callRef.current.remoteUser._id, candidate })
          },
          onTrack: (stream) => setRemoteStream(stream),
          onConnectionStateChange: (state) => console.log('Call connection state:', state),
        })

        const offer = await createOffer()
        getSocket().emit('call:offer', { callId: callRef.current.callId, to_user_id: callRef.current.remoteUser._id, sdp: offer })

        dispatch(callConnected())
      } catch (error) {
        console.log(error)
        toast.error('Failed to start call')
        teardownCall()
        dispatch(resetCall())
      }
    }

    const handleOffer = async ({ callId, sdp }) => {
      if(!sameCall({ callId })) return
      try {
        const answer = await createAnswer(sdp)
        getSocket().emit('call:answer', { callId, to_user_id: callRef.current.remoteUser._id, sdp: answer })
        dispatch(callConnected())
      } catch (error) {
        console.log(error)
      }
    }

    const handleAnswer = async ({ callId, sdp }) => {
      if(!sameCall({ callId })) return
      try {
        await applyAnswer(sdp)
      } catch (error) {
        console.log(error)
      }
    }

    const handleIceCandidate = async ({ callId, candidate }) => {
      if(!sameCall({ callId })) return
      try {
        await addIceCandidate(candidate)
      } catch (error) {
        console.log(error)
      }
    }

    const handleRejected = (payload) => {
      if(!sameCall(payload)) return
      teardownCall()
      dispatch(resetCall())
      toast('Call rejected')
    }

    const handleCancelled = (payload) => {
      if(!sameCall(payload)) return
      teardownCall()
      dispatch(resetCall())
      toast('Call cancelled')
    }

    const handleEnded = (payload) => {
      if(!sameCall(payload)) return
      teardownCall()
      dispatch(resetCall())
      toast('Call ended')
    }

    const handleResolvedElsewhere = ({ resolvingSocketId }) => {
      if(callRef.current.status === 'ringing' && resolvingSocketId !== getSocket().id){
        dispatch(resetCall())
      }
    }

    socket.on('call:incoming', handleIncoming)
    socket.on('call:accepted', handleAccepted)
    socket.on('call:offer', handleOffer)
    socket.on('call:answer', handleAnswer)
    socket.on('call:ice-candidate', handleIceCandidate)
    socket.on('call:rejected', handleRejected)
    socket.on('call:cancelled', handleCancelled)
    socket.on('call:ended', handleEnded)
    socket.on('call:resolved-elsewhere', handleResolvedElsewhere)

    return () => {
      socket.off('call:incoming', handleIncoming)
      socket.off('call:accepted', handleAccepted)
      socket.off('call:offer', handleOffer)
      socket.off('call:answer', handleAnswer)
      socket.off('call:ice-candidate', handleIceCandidate)
      socket.off('call:rejected', handleRejected)
      socket.off('call:cancelled', handleCancelled)
      socket.off('call:ended', handleEnded)
      socket.off('call:resolved-elsewhere', handleResolvedElsewhere)
      teardownCall()
    }
  }, [])

  // Call duration ticker
  useEffect(() => {
    if(call.status !== 'connected' || !call.startedAt) return

    const tick = () => {
      const elapsedSec = Math.floor((Date.now() - call.startedAt) / 1000)
      const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0')
      const ss = String(elapsedSec % 60).padStart(2, '0')
      setCallDuration(`${mm}:${ss}`)
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [call.status, call.startedAt])

  // Bind remote stream whenever it changes
  useEffect(() => {
    if(remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
    if(remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream
  }, [remoteStream])

  // Bind local stream to the local preview element whenever the rendered branch changes
  useEffect(() => {
    const stream = getLocalStream()
    if(localVideoRef.current && stream){
      localVideoRef.current.srcObject = stream
    }
  }, [call.status])

  const handleAccept = async () => {
    if(acceptingRef.current) return
    acceptingRef.current = true
    try {
      await getLocalMedia(call.callType)
      const token = await getToken()
      const iceServers = await fetchIceServers(token)

      createPeerConnection(iceServers, {
        onIceCandidate: (candidate) => {
          getSocket().emit('call:ice-candidate', { callId: call.callId, to_user_id: call.remoteUser._id, candidate })
        },
        onTrack: (stream) => setRemoteStream(stream),
        onConnectionStateChange: (state) => console.log('Call connection state:', state),
      })

      getSocket().emit('call:accept', { callId: call.callId })
    } catch (error) {
      console.log(error)
      toast.error('Camera/microphone permission is required to accept the call')
      getSocket().emit('call:reject', { callId: call.callId })
      teardownCall()
      dispatch(resetCall())
      acceptingRef.current = false
    }
  }

  const handleReject = () => {
    getSocket().emit('call:reject', { callId: call.callId })
    dispatch(resetCall())
  }

  const handleCancel = () => {
    getSocket().emit('call:cancel', { callId: call.callId })
    teardownCall()
    dispatch(resetCall())
  }

  const handleHangup = () => {
    getSocket().emit('call:end', { callId: call.callId })
    teardownCall()
    dispatch(resetCall())
  }

  const handleToggleMic = () => {
    toggleMic(!isMicOn)
    setIsMicOn(!isMicOn)
  }

  const handleToggleCamera = () => {
    toggleCamera(!isCameraOn)
    setIsCameraOn(!isCameraOn)
  }

  if(call.status === 'idle') return null

  return (
    <div className='fixed inset-0 z-[120] bg-black/90 flex flex-col items-center justify-center text-white p-4 sm:p-6 overflow-y-auto'>

      {/* Ringing — incoming call */}
      {call.status === 'ringing' && (
        <div className='flex flex-col items-center gap-4 text-center'>
          <img src={call.remoteUser?.profile_picture} alt="" className='w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg' />
          <h2 className='text-xl sm:text-2xl font-semibold'>{call.remoteUser?.full_name}</h2>
          <p className='text-gray-300'>Incoming {call.callType} call</p>
          <div className='flex items-center gap-8 mt-6'>
            <button onClick={handleReject} className='size-14 sm:size-16 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition cursor-pointer'>
              <PhoneOff className='w-6 h-6 sm:w-7 sm:h-7'/>
            </button>
            <button onClick={handleAccept} className='size-14 sm:size-16 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 active:scale-95 transition cursor-pointer'>
              <Phone className='w-6 h-6 sm:w-7 sm:h-7'/>
            </button>
          </div>
        </div>
      )}

      {/* Calling — outgoing, not yet accepted */}
      {call.status === 'calling' && (
        <div className='flex flex-col items-center gap-4 text-center relative w-full'>
          <img src={call.remoteUser?.profile_picture} alt="" className='w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg' />
          <h2 className='text-xl sm:text-2xl font-semibold'>{call.remoteUser?.full_name}</h2>
          <p className='text-gray-300'>Calling...</p>

          {call.callType === 'video' && (
            <video ref={localVideoRef} autoPlay playsInline muted className='absolute top-2 right-2 sm:top-4 sm:right-4 w-24 h-32 sm:w-32 sm:h-40 rounded-lg object-cover shadow-lg border border-white/20'/>
          )}

          <button onClick={handleCancel} className='size-14 sm:size-16 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition cursor-pointer mt-6'>
            <PhoneOff className='w-6 h-6 sm:w-7 sm:h-7'/>
          </button>
        </div>
      )}

      {/* Connected */}
      {call.status === 'connected' && (
        <div className='w-full h-full flex flex-col items-center justify-center relative'>
          {call.callType === 'video' ? (
            <>
              <video ref={remoteVideoRef} autoPlay playsInline className='w-full max-h-[60vh] sm:max-h-[75vh] object-contain rounded-lg bg-black'/>
              <video ref={localVideoRef} autoPlay playsInline muted className='absolute top-2 right-2 sm:top-4 sm:right-4 w-24 h-32 sm:w-32 sm:h-40 rounded-lg object-cover shadow-lg border border-white/20'/>
            </>
          ) : (
            <div className='flex items-center gap-8 sm:gap-12'>
              <div className='flex flex-col items-center gap-2'>
                <img src={currentUser?.profile_picture} alt="" className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg' />
                <span className='text-xs sm:text-sm text-gray-300'>You</span>
              </div>
              <div className='flex flex-col items-center gap-2'>
                <img src={call.remoteUser?.profile_picture} alt="" className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg' />
                <span className='text-xs sm:text-sm text-gray-300'>{call.remoteUser?.full_name}</span>
              </div>
              <audio ref={remoteAudioRef} autoPlay hidden/>
            </div>
          )}

          <p className='mt-4 text-gray-300 text-sm'>{callDuration}</p>

          <div className='flex items-center gap-6 mt-6'>
            <button onClick={handleToggleMic} className='size-12 sm:size-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition cursor-pointer'>
              {isMicOn ? <Mic className='w-5 h-5 sm:w-6 sm:h-6'/> : <MicOff className='w-5 h-5 sm:w-6 sm:h-6'/>}
            </button>

            {call.callType === 'video' && (
              <button onClick={handleToggleCamera} className='size-12 sm:size-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition cursor-pointer'>
                {isCameraOn ? <Video className='w-5 h-5 sm:w-6 sm:h-6'/> : <VideoOff className='w-5 h-5 sm:w-6 sm:h-6'/>}
              </button>
            )}

            <button onClick={handleHangup} className='size-14 sm:size-16 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition cursor-pointer'>
              <PhoneOff className='w-6 h-6 sm:w-7 sm:h-7'/>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default CallModal