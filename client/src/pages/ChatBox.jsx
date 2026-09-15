import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizonal, Phone, Video } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import { addMessages, fetchMessages, resetMessages } from '../features/messages/messagesSlice'
import { getSocket } from '../socket/socket.js'
import toast from 'react-hot-toast'
import { startOutgoingCall, setCallId, resetCall } from '../features/calls/callsSlice.js'
import { getLocalMedia } from '../webrtc/webrtcClient.js'

const ChatBox = () => {

  const { messages } = useSelector((state)=>state.messages)
  const onlineUserIds = useSelector((state)=>state.presence.onlineUserIds)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const [text, settext] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)
  const [seen, setSeen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const connections = useSelector((state)=>state.connections.connections)

  const fetchUserMessages = async()=>{
    try {

      dispatch(fetchMessages({ userId }))
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleTextChange = (e)=>{
    settext(e.target.value)

    getSocket().emit('typing:start', { to_user_id: userId })

    if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(()=>{
      getSocket().emit('typing:stop', { to_user_id: userId })
    }, 2000)
  }


  const sendMessage = async()=>{
    try {

      if(!text && !image) return

      let media_url = ''

      if(image){
        const formData = new FormData()
        formData.append('image', image)

        const { data } = await api.post('/api/message/upload-image', formData, {headers: {Authorization: `Bearer ${await getToken()}`}})
        if(!data.success) throw new Error(data.message)
        media_url = data.media_url
      }

      getSocket().emit('message:send', {to_user_id: userId, text, media_url, message_type: image ? 'image' : 'text'}, (ack)=>{
        if(ack.success){
          settext('')
          setImage(null)

          if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
          getSocket().emit('typing:stop', { to_user_id: userId })
        } else{
          toast.error(ack.message)
        }
      })
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const startCall = async (call_type) => {
    try {
      await getLocalMedia(call_type)
      dispatch(startOutgoingCall({ remoteUser: user, callType: call_type }))
      getSocket().emit('call:invite', { to_user_id: userId, call_type }, (ack) => {
        if(ack.success){
          dispatch(setCallId(ack.callId))
        } else {
          toast.error(ack.message)
          dispatch(resetCall())
        }
      })
    } catch (error) {
      toast.error("Camera/microphone permission is required to start a call")
    }
  }

  useEffect(()=>{
    setSeen(false)
    fetchUserMessages()

    return ()=>{
      dispatch(resetMessages())
      if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  },[userId])

  useEffect(()=>{
    const socket = getSocket()

    const handleReceive = (message)=>{
      if(message.from_user_id._id === userId || message.to_user_id === userId){
        dispatch(addMessages(message))
      }
    }

    const handleSeenUpdate = (payload)=>{
      if(payload.by === userId){
        setSeen(true)
      }
    }

    socket.on('message:receive', handleReceive)
    socket.on('message:seen-update', handleSeenUpdate)

    return ()=>{
      socket.off('message:receive', handleReceive)
      socket.off('message:seen-update', handleSeenUpdate)
    }
  },[userId, dispatch])

  useEffect(()=>{
    const socket = getSocket()

    const handleTypingUpdate = (payload)=>{
      if(payload.from_user_id === userId){
        setIsTyping(payload.isTyping)
      }
    }

    socket.on('typing:update', handleTypingUpdate)

    return ()=>{
      socket.off('typing:update', handleTypingUpdate)
    }
  },[userId])

  useEffect(()=>{
    if(connections.length > 0){
      const user = connections.find(connection => connection._id === userId)
      setUser(user)
    }
  },[connections, userId])

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behaviour: "smooth"})
  },[messages])

  const sortedMessages = messages.toSorted((a,b)=> new Date(a.createdAt) - new Date(b.createdAt))
  const lastSentIndex = sortedMessages.reduce((last, m, i)=> m.to_user_id === user?._id ? i : last, -1)
  const isOnline = onlineUserIds.includes(user?._id)

  return user && (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture} className='rounded-full size-8' alt="" />
        <div>
          <p className='font-medium'>{user.full_name}</p>
          <div className='flex items-center gap-1.5 -mt-1.5'>
            <p className='text-sm text-gray-500'>@{user.username}</p>
            <span className={`size-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <p className='text-xs text-gray-500'>{isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>

        <div className='flex items-center gap-2 ml-auto'>
          <button onClick={()=>startCall('audio')} className='w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 text-slate-500 rounded-md hover:bg-white active:scale-95 transition cursor-pointer'>
            <Phone className='w-4 h-4 sm:w-5 sm:h-5'/>
          </button>
          <button onClick={()=>startCall('video')} className='w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 text-slate-500 rounded-md hover:bg-white active:scale-95 transition cursor-pointer'>
            <Video className='w-4 h-4 sm:w-5 sm:h-5'/>
          </button>
        </div>
      </div>

      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
            sortedMessages.map((message, index)=>(
              <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                  {
                    message.message_type === 'image' && <img src={message.media_url} className='w-full max-w-sm rounded-lg mb-1' alt="" />
                  }
                  <p>{message.text}</p>
                </div>
                {
                  index === lastSentIndex && seen && (
                    <p className='text-xs text-gray-400 mt-1'>Seen</p>
                  )
                }
              </div>
            ))
          }
          <div ref={messagesEndRef}/>
        </div>
      </div>
      <div className='px-4'>
          {
            isTyping && (
              <p className='text-xs text-gray-400 italic mb-1 ml-2'>typing...</p>
            )
          }
          <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
            <input type="text" placeholder='Type a message...' onKeyDown={e=>e.key === 'Enter' && sendMessage()} onChange={handleTextChange} value={text} className='flex-1 outline-none text-slate-700' />
            <label htmlFor="image">
              {
                image 
                ? <img src={URL.createObjectURL(image)} className='h-8 rounded' alt="" /> 
                : <ImageIcon className='size-7 text-gray-400 cursor-pointer'/>
              }
              <input type="file" id='image' accept='image/*' hidden onChange={(e)=>setImage(e.target.files[0])} />
            </label>
            <button onClick={sendMessage} className='bg-gradient-to-r from-green-600 to-purple-700 hover:from-green-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
              <SendHorizonal size={18}/>
            </button>
          </div>
      </div>
    </div>
  )
}

export default ChatBox