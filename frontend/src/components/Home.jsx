import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import RightSideBar from './RightSideBar'
import useGetAllPost from '@/hook/useGetAllPost'
import useGetSuggestedUsers from '@/hook/useGetSuggestedUsers'

const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers();
    return (
        <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <RightSideBar />
        </div>
    )
}

export default Home