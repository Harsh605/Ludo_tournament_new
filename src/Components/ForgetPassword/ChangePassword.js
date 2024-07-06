import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../token.js';

import Logo from '../Logo.jsx';
function ChangePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const handlePassword = async (e) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const body = {
                password: password
            }
            const response = await axios.post(baseURL + '/user/changepassword', body, {
                headers: headers
            })
            if (response) {
                navigate("/LoginPage")
                setMessage("changed password successfully");
            }
        } catch (error) {
            console.log(error);
            setMessage(error?.response?.data?.message);
        }
    }

    return (
        <>
            <section id="main-bg">
                <div id="register-container" className="container mx-0">
                    <>
                        <div className="row " id="register">
                            <div className="card h-100 p-0">
                                <h4 className="text-center py-2">Change Password</h4>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 my-2">
                                            <input
                                                type="password"
                                                placeholder="Enter Password"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-12 my-2">
                                            <input
                                                type="text"
                                                placeholder="Confirm Password"
                                                onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>




                                        <p style={{ color: 'red' }}>{message}</p>
                                        <div className="col-12 my-2">
                                            <button
                                                className="bg-orange btn"
                                                onClick={(e) => {
                                                    // e.preventDefault(); // Add this line to prevent the default behavior
                                                    handlePassword(e)
                                                }}
                                            >
                                                Change Password
                                            </button>
                                        </div>
                                        <div className="col-12 my-2">
                                            <p className="lh-lg text-center text-light">
                                                By Continuing You agree to out<span style={{ color: '#ffb900', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/RegisterLegalPAge')}> Legal Terms</span> and you are 18 years of older.
                                            </p>
                                        </div>
                                        <div className="col-12 my-2">
                                            <p className="lh-lg text-center text-light">
                                                Already have an account?  <span style={{ color: '#ffb900', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/LoginPage')}> Login</span>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                </div>
                <div className="" style={{ position: 'fixed', top: '50%', left: 'calc(100% - 40%)', transform: `translate(-50%,-50%)`, zIndex: 5 }}>
                    <div className="rcBanner flex-center">
                        <Logo />
                        {/* <picture className="rcBanner-img-containerr">
                            <img style={{ marginLeft: '10px', width: "80% ", borderRadius: '50%' }} src="./images/Ludolkjpg.jpg" alt />
                        </picture>
                        <div className="rcBanner-text">Play Ludo &amp; <span className="rcBanner-text-bold">Win Real Cash!</span></div>
                        <div className="rcBanner-footer">For best experience, open&nbsp;<a href="/">ludokavish.com</a>&nbsp;on&nbsp;&nbsp;chrome </div> */}
                    </div>

                </div>
            </section>
        </>
    )
}


export default ChangePassword