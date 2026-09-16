import React, { useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import Notifications from './pages/Notifications.jsx'
import { useUser, useAuth } from '@clerk/clerk-react'
import Layout from './pages/Layout'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import axios from 'axios'
import { assets } from './assets/assets'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice.js'
import { fetchConnections } from './features/connections/connectionsSlice.js'
import { setSnapshot, userOnline, userOffline } from './features/presence/presenceSlice.js'
import { fetchNotifications, addNotification } from './features/notifications/notificationsSlice.js'
import Notification from './components/Notification.jsx'
import { connectSocket, disconnectSocket, getSocket } from './socket/socket.js'

const App = () => {
  
  const { user } = useUser()
  const {getToken} = useAuth()
  const { pathname } = useLocation()
  const pathnameRef = useRef(pathname)

  const dispatch = useDispatch();

  useEffect(()=>{
    const fetchData = async()=>{
      if(user){
        const token = await getToken()
        dispatch(fetchUser(token))
        dispatch(fetchConnections(token))
        dispatch(fetchNotifications(token))
      }
    }
    fetchData()
  },[user, getToken, dispatch])


  useEffect(()=>{
    pathnameRef.current = pathname
  },[pathname])

  useEffect(() => {
    if(!user) return

    const socket = connectSocket(getToken)

    const handleMessage = (message) => {
        if(message.from_user_id._id === user.id) return
        const otherPartyId = message.from_user_id._id
        if(pathnameRef.current !== ('/messages/' + otherPartyId)){
            toast.custom((t) => (<Notification t={t} message={message}/>), {position: "bottom-right"})
        }
    }

    const handleSnapshot = ({ onlineUserIds }) => dispatch(setSnapshot(onlineUserIds))
    const handlePresenceUpdate = ({ userId, status }) => dispatch(status === 'online' ? userOnline(userId) : userOffline(userId))
    const handleNewNotification = (notification) => dispatch(addNotification(notification))

    socket.on('message:receive', handleMessage)
    socket.on('presence:snapshot', handleSnapshot)
    socket.on('presence:update', handlePresenceUpdate)
    socket.on('notification:new', handleNewNotification)

    return () => {
        socket.off('message:receive', handleMessage)
        socket.off('presence:snapshot', handleSnapshot)
        socket.off('presence:update', handlePresenceUpdate)
        socket.off('notification:new', handleNewNotification)
        disconnectSocket()
    }
}, [user])
  

// useEffect(() => {
//   const laura = async () => {
//     console.log("🔥 useEffect started");

//     try {
//       // 1️⃣ Check user
//       if (!user) {
//         console.log("❌ User is not loaded yet");
//         return;
//       }

//       console.log("✅ User loaded:", user.id);

//       // 2️⃣ Get token
//       console.log("⏳ Fetching token...");
//       const token = await getToken();

//       if (!token) {
//         console.log("❌ Token is null or undefined");
//         return;
//       }

//       console.log("✅ Token received (first 20 chars):", token.substring(0, 20));

//       // 3️⃣ Prepare request body
//       const requestBody = {
//         username: "aaryan1981",
//         bio: "Mai tera baap hu",
//         location: "India",
//         full_name: "Arpita Tiwari",
//         profile: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
//         cover: "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
//       };

//       const response = await axios.post(
//         "http://localhost:4000/api/user/update",
//         requestBody,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log(response.data)

//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   laura();
// }, [user]);



// Send Post

  // useEffect(()=>{

  //   try {
      
  //     const sendpostreq = async()=>{
  //       const token = await getToken();
  //       const requestBody = {
  //         content: "Hi, This is my post on Vanilla...!",
  //         post_type: "text",
  //       };
  //       const response = await axios.post(
  //         "http://localhost:4000/api/post/add",
  //         requestBody,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log(response.data)
        
  //     }
  //     sendpostreq()
  //   } catch (error) {
  //     console.log(error.message);
  //   }


  // },[user])
  // useEffect(()=>{

  //   try {
      
  //     const sendpostreq = async()=>{
  //       const token = await getToken();
  //       const response = await axios.get(
  //         "http://localhost:4000/api/post/feed",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log(response.data)
        
  //     }
  //     sendpostreq()
  //   } catch (error) {
  //     console.log(error.message);
  //   }


  // },[user])


  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={ !user ? <Login/> : <Layout/>}>
          <Route index element={<Feed/>}/>
          <Route path='notifications' element={<Notifications/>}/>
          <Route path='messages' element={<Messages/>}/>
          <Route path='messages/:userId' element={<ChatBox/>}/>
          <Route path='connections' element={<Connections/>}/>
          <Route path='discover' element={<Discover/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='profile/:profileId' element={<Profile/>}/>
          <Route path='create-post' element={<CreatePost/>}/>
        </Route>
      </Routes>

    </div>
  )
}

export default App