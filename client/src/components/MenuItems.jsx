import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import { Icon } from 

const MenuItems = ({ setsideBarOpen }) => {

    const unreadCount = useSelector((state) => state.notifications.unreadCount)

  return (
    <div className='px-6 text-gray-600 space-y-1 font-medium'>
        {
            menuItemsData.map(({to, label, Icon})=>(
                <NavLink key={to} to={to} end={to === '/'} onClick={()=>setsideBarOpen(false)} className={({isActive})=> `px-3.5 py-2 flex items-center gap-3 rounded-xl ${isActive ? 'bg-indigo-50 text-green-700' : 'hover:bg-gray-50'}`}>
                    {
                        label === 'Notifications' ? (
                            <div className='relative'>
                                <Icon className='w-5 h-5'/>
                                {
                                    unreadCount > 0 && (
                                        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] size-4 rounded-full flex items-center justify-center'>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )
                                }
                            </div>
                        ) : (
                            <Icon className='w-5 h-5'/>
                        )
                    }
                    {label}
                </NavLink>
            ))
        }
    </div>
  )
}

export default MenuItems