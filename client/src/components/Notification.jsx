import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Loading from '../components/Loading'
import { fetchNotifications, markAllRead } from '../features/notifications/notificationsSlice.js'

const getNotificationMessage = (notification) => {
    const name = notification.sender?.full_name
    switch (notification.type) {
        case 'like': return `${name} liked your post`
        case 'follow': return `${name} started following you`
        case 'connection_request': return `${name} sent you a connection request`
        case 'connection_accepted': return `${name} accepted your connection request`
        case 'comment': return `${name} commented on your post`
        case 'new_post': return `${name} shared a new post`
        case 'new_story': return `${name} shared a new story`
        case 'story_view': return `${name} viewed your story`
        default: return ''
    }
}

const Notifications = () => {

    const { items } = useSelector((state) => state.notifications)
    const { getToken } = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getToken().then((token)=>{
            dispatch(fetchNotifications(token)).then(()=>{
                setLoading(false)
                dispatch(markAllRead(token))
            })
        })
    },[])

    const handleNotificationClick = (notification)=>{
        switch (notification.type) {
            case 'like':
            case 'comment':
                navigate('/profile')
                break
            case 'follow':
            case 'connection_accepted':
            case 'story_view':
                navigate(`/profile/${notification.sender._id}`)
                break
            case 'connection_request':
                navigate('/connections')
                break
            case 'new_post':
            case 'new_story':
                navigate('/')
                break
            default:
                break
        }
    }

  return !loading ? (
    <div className='min-h-screen bg-slate-50'>
        <div className='max-w-3xl mx-auto p-6'>
          {/* Title */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>Notifications</h1>
            <p className='text-slate-600'>Stay up to date with your activity.</p>
          </div>

          {
            items.length === 0 ? (
                <div className='bg-white shadow rounded-md p-10 text-center text-slate-500'>
                    No notifications yet.
                </div>
            ) : (
                <div className='flex flex-col gap-3'>
                    {
                        items.map((notification)=>(
                            <div key={notification._id} onClick={()=>handleNotificationClick(notification)} className='flex items-center gap-4 p-4 bg-white shadow rounded-md cursor-pointer hover:bg-slate-50 transition'>
                                <img src={notification.sender?.profile_picture} className='w-10 h-10 rounded-full shadow shrink-0' alt="" />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm text-slate-700'>{getNotificationMessage(notification)}</p>
                                    <p className='text-xs text-slate-400 mt-1'>{moment(notification.createdAt).fromNow()}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
          }
        </div>
    </div>
  ) : <Loading height='60vh'/>
}

export default Notifications