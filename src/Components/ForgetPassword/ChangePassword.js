import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../token.js';
import { Button, TextField, Typography, Container } from '@mui/material';

// import Logo from '../Logo.jsx';
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
                navigate("/")
                setMessage("changed password successfully");
            }
        } catch (error) {
            console.log(error);
            setMessage(error?.response?.data?.message);
        }
    }

    return (
        <>
            <Container component="main" maxWidth="xs" sx={{ width: '100%', padding: '64px' }}>
                <div className="registration-container">
                    <>
                        <Typography sx={{ fontWeight: '600', fontSize: '24px', marginBottom: '0.5rem' }} variant="h5">Change Password</Typography>
                        {/* <div className="col-12 my-2"> */}
                        {/* <input
                                type="password"
                                placeholder="Enter Password"
                                onChange={(e) => setPassword(e.target.value)}
                            /> */}
                        <TextField
                            label="Enter Password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={password}
                            type="password"
                            placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* </div> */}

                        {/* <div className="col-12 my-2"> */}
                        {/* <input
                                type="text"
                                placeholder="Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)} /> */}
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="email"
                            value={confirmPassword}
                            type="text"
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {/* </div> */}
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
                    </>
                </div >

            </Container >
        </>
    )
}


export default ChangePassword