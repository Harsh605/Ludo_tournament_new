import React from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Logo from '../Logo.jsx';
import { baseURL } from '../../token.js';
import { Button, TextField, Typography, Container } from '@mui/material';


const GetForgetOtp = () => {
    const navigate = useNavigate()
    const [otpInputs, setOtpInputs] = useState(['', '', '', '']);
    const [message, setMessage] = useState("");
    const location = useLocation();
    const { state } = location;

    // Access the data from state or query parameters
    const email = state ? state.email : '';


    const handleInputChange = (index, value) => {
        // Create a new array with the updated value at the specified index
        const updatedValues = [...otpInputs];
        updatedValues[index] = value;
        setOtpInputs(updatedValues);
        setMessage('')
    };

    const handleSubmit = async () => {
        try {
            const body = {
                email: email,
                role: 'basic',
                OTP: otpInputs.join("")
            }
            const response = await axios.post(baseURL + '/user/verifyemail', body)
            if (response.data) {
                localStorage.setItem('access_token', response.data.data.accessToken);
                navigate("/changePassword")
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
                    <Typography sx={{ fontWeight: '600', fontSize: '24px', marginBottom: '0.5rem' }} variant="h5">Forget Password</Typography>
                    <Typography sx={{ fontSize: '16px' }} variant="h5" >Firstly verify email</Typography>

                    <div className="card-body">
                        <div className="row">
                            <>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    name="email"
                                    value={email}
                                    placeholder="Enter  Your Email"
                                    disabled />
                                <div style={{ paddingTop: '20px' }} className="col-12 d-flex my-2 otp-input">
                                    <div className="card card-body p-0 mx-1">
                                        <input
                                            className="border rounded p-2 text-center otp-input"
                                            id="otp1"
                                            value={otpInputs[0]}
                                            onChange={(e) => handleInputChange(0, e.target.value)}

                                            type="text"
                                            maxLength={1}
                                            style={{ outline: 'none', border: 'none', width: '100%' }}
                                        />
                                    </div>
                                    <div className="card card-body p-0 mx-1">
                                        <input
                                            className="border rounded p-2 text-center otp-input"
                                            id="otp2"
                                            type="text"
                                            value={otpInputs[1]}
                                            onChange={(e) => handleInputChange(1, e.target.value)}
                                            maxLength={1}
                                            style={{ outline: 'none', border: 'none', width: '100%' }}
                                        />
                                    </div>
                                    <div className="card card-body p-0 mx-1">
                                        <input
                                            className="border rounded p-2 text-center otp-input"
                                            id="otp3"
                                            type="text"
                                            value={otpInputs[2]}
                                            onChange={(e) => handleInputChange(2, e.target.value)}
                                            maxLength={1}
                                            style={{ outline: 'none', border: 'none', width: '100%' }}
                                        />
                                    </div>
                                    <div className="card card-body p-0 mx-1">
                                        <input
                                            className="border rounded p-2 text-center otp-input"
                                            id="otp4"
                                            type="text"
                                            value={otpInputs[3]}
                                            onChange={(e) => handleInputChange(3, e.target.value)}
                                            maxLength={1}
                                            style={{ outline: 'none', border: 'none', width: '100%' }}
                                        />
                                    </div>

                                </div>


                            </>
                            <div className="col-12 my-2">
                                <button
                                    className="bg-orange btn"
                                    onClick={handleSubmit}
                                >
                                    Verify OTP
                                </button>

                                <p style={{ color: 'red' }}>{message}</p>


                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default GetForgetOtp