import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
        

      </div>
    </div>
  ) : <Loading/>
}

export default Profile