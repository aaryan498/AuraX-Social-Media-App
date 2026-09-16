import React, { useEffect, useState } from 'react'
import { SendHorizonal, Trash2 } from 'lucide-react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios.js'
import toast from 'react-hot-toast'
import { getSocket } from '../socket/socket.js'
import Loading from './Loading'

const CommentsSection = ({ postId }) => {

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState('')

    const currentUser = useSelector((state)=>state.user.value)
    const { getToken } = useAuth()

    const fetchComments = async ()=>{
        try {

            setLoading(true)
            const { data } = await api.get(`/api/comment/${postId}`, {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setComments(data.comments)
            } else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    useEffect(()=>{
        fetchComments()

        const socket = getSocket()
    if(!socket) return;

        const handleNewComment = (payload)=>{
            if(payload.postId !== postId) return
            setComments(prev=>{
                if(prev.some(comment=>comment._id === payload.comment._id)) return prev
                return [...prev, payload.comment]
            })
        }

        const handleDeletedComment = (payload)=>{
            if(payload.postId !== postId) return
            setComments(prev=>prev.filter(comment=>comment._id !== payload.commentId))
        }

        socket.on('comment:new', handleNewComment)
        socket.on('comment:deleted', handleDeletedComment)

        return ()=>{
            socket.off('comment:new', handleNewComment)
            socket.off('comment:deleted', handleDeletedComment)
        }
    },[postId])

    const handleAddComment = async ()=>{
        if(!text.trim()) return

        try {

            const { data } = await api.post('/api/comment/add', {postId, text}, {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setText('')
            } else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteComment = async (commentId)=>{
        try {

            const { data } = await api.post('/api/comment/delete', {commentId}, {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(!data.success){
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='mt-2 pt-3 border-t border-gray-200'>

        {/* Comments List */}
        {
            loading ? (
                <Loading height='100px'/>
            ) : (
                <div className='flex flex-col divide-y divide-gray-100 max-h-72 overflow-y-auto no-scrollbar mb-3'>
                    {
                        comments.length === 0 ? (
                            <p className='text-sm text-gray-400 text-center py-4'>No comments yet — be the first to comment</p>
                        ) : (
                            comments.map((comment)=>(
                                <div key={comment._id} className='flex items-start gap-2.5 py-2.5'>
                                    <img src={comment.user.profile_picture} className='w-8 h-8 rounded-full shadow shrink-0' alt="" />
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center justify-between gap-2'>
                                            <span className='font-medium text-sm text-slate-800 truncate'>{comment.user.full_name}</span>
                                            <span className='text-[10px] text-slate-400 whitespace-nowrap'>{moment(comment.createdAt).fromNow()}</span>
                                        </div>
                                        <p className='text-sm text-gray-600 break-words'>{comment.text}</p>
                                    </div>
                                    {
                                        comment.user._id === currentUser._id && (
                                            <Trash2 onClick={()=>handleDeleteComment(comment._id)} className='w-4 h-4 mt-1 text-gray-400 hover:text-red-500 cursor-pointer transition-colors shrink-0'/>
                                        )
                                    }
                                </div>
                            ))
                        )
                    }
                </div>
            )
        }

        {/* Add Comment */}
        <div className='flex items-center gap-3 pl-4 p-1.5 bg-white w-full border border-gray-200 shadow-sm rounded-full'>
            <input type="text" placeholder='Write a comment...' onKeyDown={e=>e.key === 'Enter' && handleAddComment()} onChange={(e)=>setText(e.target.value)} value={text} className='flex-1 outline-none text-slate-700 text-sm min-w-0' />
            <button onClick={handleAddComment} className='bg-gradient-to-r from-green-600 to-purple-700 hover:from-green-700 hover:to-purple-800 active:scale-95 transition cursor-pointer text-white p-2 rounded-full shrink-0'>
                <SendHorizonal size={16}/>
            </button>
        </div>

    </div>
  )
}

export default CommentsSection