import React, { useState } from 'react';
import { Button, TextField, Typography, Container, InputAdornment, IconButton } from '@mui/material';
import './AdminRegistrationPage.css';
import { baseURL, token } from '../../token';
import Swal from "sweetalert2";
import axios from 'axios';
import { BrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { Visibility, VisibilityOff } from '@mui/icons-material';


function AdminLoginPage() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [Phone, setPhone] = useState();
    const [twofactor_code, settwofactor_code] = useState();
    const [otp, setOtp] = useState(false);
    const [secretCode, setSecretCode] = useState();

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginSuccessful, setLoginSuccessful] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Step 2

    const navigate = useNavigate();
    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        // setLoginData((prevData) => ({ ...prevData, [name]: value }));
        if (name === 'Phone')
            setPhone(value)
        if (name === 'twofactor_code')
            settwofactor_code(value)
        // Clear the respective error message when user starts typing
        if (name === 'Phone') {
            setEmailError('');
        }
        if (name === 'twofactor_code') {
            setPasswordError('');
        }
    };

    const handleAdminLogin = async () => {
        try {
            const requestBody = {
                email: loginData.email,
                password: loginData.password,
            };
            // console.log(requestBody);
            // const accessToken = localStorage.getItem('access_token');
            // const accessToken = token;
            // const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const response = await axios.post(baseURL + '/admin/login', requestBody);

            // console.log(response.data.data.token);
            console.log(response);
            if (response.status === 200) {
                // localStorage.setItem('access_token', response.data.data.token);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
                localStorage.setItem('access_token', response?.data?.data?.token);
                localStorage.setItem('access_token_expiration', expirationDate.toISOString());
                setLoginSuccessful(true);
                navigate('/dashboard')
            }

            setEmailError('');
            setPasswordError('');
        }
        catch (err) {
            console.log(err);

            if (err.response && err.response.status === 401) {
                setEmailError('Incorrect email or password.');
                setPasswordError('Incorrect email or password.');
            } else {
                setEmailError('An error occurred while logging in.');
                setPasswordError('An error occurred while logging in.');
            }
            // Enable the Get OTP button
        }


        if (loginData.email === '') {
            setEmailError('Please enter your email.');
            return;
        }

        if (loginData.password === '') {
            setPasswordError('Please enter your password.');
            return;
        }

    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (!Phone) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter your phone number",
            });
        } else {
            await axios
                .post(baseURL + `login/admin`, {
                    Phone,
                })
                .then((respone) => {
                    if (respone.data.status == 101) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: respone.data.msg,
                        });
                    } else if (respone.data.status == 200) {
                        setOtp(true);
                        setSecretCode(respone.data.secret);
                        if (respone.data.myToken) {
                            Swal.fire({
                                icon: "success",
                                title: "OTP",
                                text: "OTP For Test Login: " + respone.data.myToken,
                            });
                        }
                    }
                })
                .catch((e) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Invalid Mobile Number.",
                        // width: '20%',
                        // height:'20%',
                    });
                });
        }
    };

    const varifyOtp = async (e) => {
        e.preventDefault();
        console.log("verify otp sumbut req");
        if (!Phone) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter your phone number",
            });
        } else {
            await axios
                .post(baseURL + `login/admin/finish`, {
                    Phone,
                    twofactor_code,
                    secretCode,
                })
                .then((respone) => {
                    if (respone.data.status == 101) {

                    } else if (respone.status === 200) {
                        if (respone?.data?.msg === 'Current password is not a match.') {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: 'Password does not match.',
                            });
                            return
                        }
                        // localStorage.setItem('access_token', response.data.data.token);
                        const now = new Date();
                        const expirationDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
                        localStorage.setItem('access_token', respone?.data?.token);
                        localStorage.setItem('adminDetails', JSON.stringify(respone?.data?.user));
                        localStorage.setItem('access_token_expiration', expirationDate.toISOString());
                        setLoginSuccessful(true);
                        navigate('/dashboard')
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    }
                })
                .catch((e) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                });
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Step 3
    };


    return (


        //         <>
        //             <div className="container max-w-md mx-auto  flex justify-center items-center xl:max-w-lg  flex bg-white rounded-lg shadow overflow-hidden">
        //   <div className="w-full xl:w-full p-8">
        //     <form>
        //       <h1 className="text-2xl font-bold text-[#452a72]">Sign in to your account</h1>
        //       <button>Admin Signup</button>
        //       <div className="mb-6 mt-6">
        //         <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
        //         <input className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10" id="email" type="text" placeholder="Your email address" defaultValue />
        //       </div>
        //       <div className="mb-3 mt-6"><label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
        //         <input className="mb-2 text-sm bg-gray-200 appearance-none rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline h-10" id="password" type="password" placeholder="Your password" defaultValue />
        //       </div>
        //       <div className="flex w-full mt-8">
        //         <button className="w-full bg-[#452a72] hover:bg-transparent hover:text-[#452a72] hover:border hover:border-[#452a72] text-white text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10" type="submit">Sign in</button>
        //       </div>
        //     </form>
        //   </div>
        // </div>

        //         </>
        <> {loginSuccessful ? (<> <Header />
        </>) :
            (<>
                <Container component="main" maxWidth="xs" sx={{ width: '100%', padding: '64px' }}>
                    <div className="registration-container">
                        <Typography sx={{ fontWeight: '600', fontSize: '24px', marginBottom: '0.5rem' }} variant="h5">Admin Sign in  to your account </Typography>
                        <Typography sx={{ fontSize: '16px' }} variant="h5">Admin Sign up</Typography>
                        <TextField
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="Phone"
                            value={Phone}
                            onChange={handleLoginInputChange}

                        />
                        {emailError && <Typography color="error">{emailError}</Typography>}
                        {otp && <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'} // Toggle password visibility
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="twofactor_code"
                            value={twofactor_code}
                            onChange={handleLoginInputChange}
                            InputProps={{ // Add the eye button
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={toggleShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}

                        />}
                        {passwordError && <Typography color="error">{passwordError}</Typography>}
                        <div className="col-12 my-2">
                            {/* <a href> */}
                                {/* <button type='submit' style={{ color: 'black' }} onClick={() => navigate("forgetPassword")}>Forget Password</button> */}
                            {/* </a> */}
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={(e) => !otp ? handleClick(e) : varifyOtp(e)}
                        >
                            {otp ? 'Login' : 'Verify'}
                        </Button>

                    </div>
                </Container>
            </>)}


        </>
    );
}

export default AdminLoginPage;
