import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'

const Feed = () => {


  const [feeds, setfeeds] = useState([])
  const [loading, setloading] = useState(true)
  const fetchFeeds = async ()=>{
    setfeeds(dummyPostsData)
    setloading(false)
  }

  useEffect(()=>{
    fetchFeeds()
  },[])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>

      {/* Stories and Posts List */}
      <div >
        <StoriesBar/>
        <div className='p-4 space-y-6'>
          <h1>Posts Here</h1>
        </div>
      </div>

      {/* Right Side content */}
      <div>
        <div>
          <h1>Sponsored</h1>
        </div>
        Recent Messages
      </div>
      


    </div>
  ) : <Loading/>
}

export default Feed