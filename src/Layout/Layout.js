import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/Header'
import { useEffect } from 'react'
import axios from 'axios'
import { baseURL } from '../token'
import { useState } from 'react'
import Swal from 'sweetalert2'

const Layout = () => {

    const [permission, setPermission] = useState({})

    const MyData = () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            axios.get(baseURL + `me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (res.data.user_type === "Admin") {
                    setPermission({
                        usertype: "Admin",
                        dashboard: true,
                        earning: true,
                        allAdmin: true,
                        allUsers: true,
                        kycDetail: true,
                        allIncome: true,
                        allGame: true,
                        completedGame: true,
                        conflictGame: true,
                        cancelledGame: true,
                        runningGame: true,
                        dropGame: true,
                        penaltyBonus: true,
                        deposit: true,
                        withdrawl: true,
                        transactionHistory: true,
                        masterSetting: true,
                    });
                } else if (res.data.user_type === "Agent") {
                    setPermission({
                        usertype: "Agent",
                        userName: res.data.Name,
                        dashboard: res.data.Permissions[0].Status,
                        earning: res.data.Permissions[1].Status,
                        allAdmin: res.data.Permissions[2].Status,
                        allUsers: res.data.Permissions[3].Status,
                        kycDetail: res.data.Permissions[4].Status,
                        allIncome: res.data.Permissions[5].Status,
                        allGame: res.data.Permissions[6].Status,
                        completedGame: res.data.Permissions[7].Status,
                        conflictGame: res.data.Permissions[8].Status,
                        cancelledGame: res.data.Permissions[9].Status,
                        runningGame: res.data.Permissions[10].Status,
                        dropGame: res.data.Permissions[11].Status,
                        penaltyBonus: res.data.Permissions[12].Status,
                        deposit: res.data.Permissions[13].Status,
                        withdrawl: res.data.Permissions[14].Status,
                        transactionHistory: res.data.Permissions[15].Status,
                        masterSetting: res.data.Permissions[16].Status
                    });
                }
            }).catch(err => {
                console.log(err);
                if (err.response.data === "pls login") {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('adminDetails')
                    localStorage.removeItem('access_token_expiration')
                    window.location.href = '/'
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong",
                    });
                }
            });
        }

    }

    useEffect(() => {
        MyData()
    }, [])

    return (
        <>
            <Header outlet={<Outlet />} permission={permission} />
            

        </>

    )
}

export default Layout