import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import validator from 'validator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

import axios from 'axios';
import { baseURL } from '../../token';
import Logo from '../Logo';
import Swal from 'sweetalert2';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const handleValidation = () => {
        // Reset previous error messages
        setEmailError('');
        setPasswordError('');
        setMessage('')

        // Perform validation
        let isValid = true;

        // if (!validator.isEmail(email)) {
        //     setEmailError('Invalid email format');
        //     isValid = false;
        // }

        if (validator.isEmpty(password)) {
            setPasswordError('Password is required');
            isValid = false;
        }

        return isValid;
    };


    const handleSubmit = async (e) => {
        setMessage('');
        e.preventDefault();
        // Reset previous error messages
        setEmailError('');
        setPasswordError('');

        // Perform validation
        // if (!validator.isEmail(email)) {
        //     setEmailError('Invalid email format');
        // }
        if (validator.isEmpty(password)) {
            setPasswordError('Password is required');
        }

        // If no errors, proceed with form submission
        if (validator.isEmail(email) && !validator.isEmpty(password)) {
            // Perform your submission logic here
        }
        if (handleValidation()) {
            // Validation passed, proceed with form submission logic
            console.log('Form submitted successfully');
        }

        const body = {
            Phone: email,
            Password: password
        }
        // console.log(body);
        try {
            const response = await axios.post(baseURL + '/login', body)
            // console.log(response.data)
            // localStorage.setItem('access_token', response.data.data.token);
            if (response?.data?.msg === 'Wrong password' && response?.data?.status === 101) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response?.data?.msg,
                });
                return
            }
            if (response?.data?.msg === 'User does not exist.' && response?.data?.status === 101) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response?.data?.msg,
                });
                return
            }
            if (response?.data?.msg === 'You are Blocked. Please contact to admin.' && response?.data?.status === 101) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response?.data?.msg,
                });
                return
            }
            const now = new Date();
            const expirationDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
            localStorage.setItem('access_token', response?.data?.token);
            localStorage.setItem('access_token_expiration', expirationDate.toISOString());
            if (response.status === 200) {
                navigate('/UserPage')
            }
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err?.response?.data?.msg,
            });
            setMessage(err?.response?.data?.message);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Step 3
    };

    return (
        <>
            <section id="main-bg">
                <div id="login-container" className="container mx-0">
                    <div className="row " id="login">
                        <div className="card h-100 p-0">
                            <h4 className="text-center py-2">Login</h4>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 my-2 mt-4">
                                        <input type="number" placeholder="Enter  Your Mobile No." onChange={(e) => setEmail(e.target.value)}
                                            style={{ borderColor: emailError ? 'red' : '' }} />
                                        {emailError && <p style={{ color: 'red' }} className="error-message">{emailError}</p>}
                                    </div>
                                    <div className="col-12 my-2 mt-4">
                                        <input type={showPassword ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)}
                                            style={{ borderColor: passwordError ? '1px solid red' : '' }} />

                                        <InputAdornment position="end" style={{float: 'right', marginTop: "-21px", marginRight: "16px"}}>
                                            <IconButton
                                                onClick={toggleShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>

                                    </div>
                                    {passwordError && <p style={{ color: 'red' }} className="error-message">{passwordError}</p>}
{/* 
                                    <div className="col-12 my-2">
                                        <a href>
                                            <button type='submit' style={{ color: 'white', backgroundColor: '#0d6efd', padding: '0.4rem', borderRadius: "4px" }} onClick={() => navigate("/forgetPassword")}>Forget Password</button>
                                        </a>
                                    </div> */}
                                    <div className="col-12 my-2">
                                        <a href>
                                            <button type='submit' className="bg-orange btn" onClick={handleSubmit}>Login </button>
                                        </a>
                                    </div>
                                    <div>
                                        <p style={{ color: 'red' }}>{message}</p>
                                    </div>
                                    <div className="col-12 my-2">
                                        <p className="lh-md text-center text-light">
                                            By Continuing You agree to out <span style={{ color: '#ffb900', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/RegisterLegalPage')}> Legal Terms</span> and you are 18 years of older.
                                        </p>
                                    </div>
                                    <div className="col-12 my-2">
                                        <p className="lh-lg text-center text-light">
                                            Don’t have an account? <span style={{ color: '#ffb900', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/RegisterPage')}> Register</span> .
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
            </section >

        </>
    )
}

export default LoginPage;