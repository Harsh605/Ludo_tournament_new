import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { baseURL } from '../token';
import axios from 'axios';
import logo from '../styles/logo.jpg'
import { handleUnAuthorized } from '../Components/hooks/handleUnAuthorized'

function HeaderComponent({ userData }) {
    const navigate = useNavigate();

    return (
        <>

            <div className="row py-2 align-items-center" style={{ backgroundColor: '#371B58' }}>
                <div className="col-1 d-flex align-items-center">
                    <h4 className="mb-0"><i onClick={() => navigate('/UserPage')} className="bi bi-list" style={{ color: 'white', cursor: 'pointer' }} /></h4>
                </div>
                <div className="col-3" style={{ width: '90px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => navigate('/PlayPage')}>
                    {/* <span style={{ cursor: 'pointer' }} onClick={() => navigate('/PlayPage')}><img style={{ width: '40px', borderRadius: '50%' }} src={Logo} alt /></span> */}

                    <img style={{ marginLeft: '10px', width: "80% ", borderRadius: '50%' }} src={logo} alt />
                </div>
                <div className="col-8 d-flex justify-content-end">
                    {/* <button className="btn btn-light mx-2 align-items-center" onClick={() => navigate('/LanguagesPage')}><i className="bi bi-translate text-primary" /> Language</button> */}
                    <button onClick={() => navigate('/WalletPage')} className="btn btn-light align-items-center"><i className="bi bi-wallet-fill text-success" />&nbsp;{userData?.Wallet_balance}</button>
                    <button onClick={() => navigate('/share')} className="btn btn-light align-items-center ml-2"><i className="bi bi-gift-fill text-red" style={{ color: 'red' }} />&nbsp;{userData?.referral_earning}</button>
                </div>
            </div>
        </>
    )
}

export default HeaderComponent;