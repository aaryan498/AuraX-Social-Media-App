import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { dummyUserData, dummyPostsData } from '../assets/assets'

const Profile = () => {



  const { profileId } = useParams()
  const [user, setuser] = useState(null)
  const [posts, setposts] = useState([])
  const [activeTab, setactiveTab] = useState('posts')
  const [showEdit, setshowEdit] = useState('false')



  const fetchUser = async () => {
    setuser(dummyUserData)
    setposts(dummyPostsData)
  }

  useEffect(()=>{
    fetchUser()
  },[])



  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
            {user.cover_photo && <img src={user.cover_photo} alt='' className='w-full h-full object-cover'/>}
          </div>
          {/* User Info */}
          
        </div>

      </div>
    </div>
  ) : <Loading/>
}

export default Profile