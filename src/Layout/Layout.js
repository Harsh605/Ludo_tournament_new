import React from 'react'
import { Outlet } from 'react-router-dom'
// import Header from '../Components/Header'
import HeaderComponent from '../Components/HeaderComponent'
// import MainPage from '../Components/MainPage'
import UserSection from '../Components/UserView/UserSection'
import UserPage from '../Components/UserView/UserPage'
import HistoryPage from '../Components/HistoryPage'

const Layout = () => {

    return (
        <>
            {/* <HeaderComponent outlet={<Outlet />} /> */}
            {/* <MainPage outlet={<Outlet />} /> */}
            {/* <UserPage outlet={<Outlet />} /> */}
            <UserSection outlet={<Outlet />} />
            {/* <HistoryPage outlet={<Outlet />} /> */}
        </>
    )
}

export default Layout