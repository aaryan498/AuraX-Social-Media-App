import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizonal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import { addMessages, fetchMessages, resetMessages } from '../features/messages/messagesSlice'
import { getSocket } from '../socket/socket.js'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const { messages } = useSelector((state)=>state.messages)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const [text, settext] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)
  const [seen, setSeen] = useState(false)

  const messagesEndRef = useRef(null)

  const connections = useSelector((state)=>state.connections.connections)

  const fetchUserMessages = async()=>{
    try {

      dispatch(fetchMessages({ userId }))
      
    } catch (error) {
      toast.error(error.message)
    }
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
        } else{
          toast.error(ack.message)
        }
      })
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    setSeen(false)
    fetchUserMessages()

    return ()=>{
      dispatch(resetMessages())
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

  return user && (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture} className='rounded-full size-8' alt="" />
        <div>
          <p className='font-medium'>{user.full_name}</p>
          <p className='text-sm text-gray-500 -mt-1.5'>@{user.username}</p>
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
          <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
            <input type="text" placeholder='Type a message...' onKeyDown={e=>e.key === 'Enter' && sendMessage()} onChange={(e)=>settext(e.target.value)} value={text} className='flex-1 outline-none text-slate-700' />
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