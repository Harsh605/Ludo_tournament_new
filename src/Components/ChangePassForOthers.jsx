import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from './../token.js';
import { Button, TextField, Typography, Container } from '@mui/material';
import Swal from 'sweetalert2';

// import Logo from '../Logo.jsx';
function UpdatePasswordForOthers() {
    const {id} = useParams();
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const addAdmin = async (e) => {

        e.preventDefault();

        const access_token = localStorage.getItem("access_token")

        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        if(!password || !confirmPassword ){
            alert("Please fill all details");
        }
        else if (password !== confirmPassword) {
            alert("Passwords don't match");
        } else {
            const data = await axios.post(baseURL + "changepasswordForOthers", {
                userID :id,
                newPassword: password,
                confirmNewPassword: confirmPassword,
            },
                { headers }).then((res) => {
                    if (res.data.msg === 'Current password is not a match.')
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: res.data.msg,
                        });
                    else if (res.data.status === 'true') {
                        setPassword('')
                        setConfirmPassword('')
                        Swal.fire({
                            icon: "success",
                            title: "Successfully",
                            text: `Password update successfully`,
                        });
                    }

                    // history.push("/admin/alladmins")
                })
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
                            required
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
                            required
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
                                    addAdmin(e)
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


export default UpdatePasswordForOthers