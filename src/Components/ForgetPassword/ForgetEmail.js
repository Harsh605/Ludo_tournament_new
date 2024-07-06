import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import validator from 'validator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios, { Axios } from 'axios';
import { baseURL } from '../../token';
// import Logo from '../Logo';
import { Button, TextField, Typography, Container } from '@mui/material';


function ForgetEmail() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const body = {
                email: email,
                role: 'basic'
            }
            const response = await axios.post(baseURL + '/user/otpemail', body)
            if (response) {
                const handlestate = {
                    email: email
                }
                navigate("/getForgetOtp", { state: handlestate })
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
                    {/* <section id="main-bg"> */}
                    {/* <div id="login-container" className="container mx-0"> */}
                    {/* <div className="row " id="login">
                        <div className="card h-100 p-0"> */}
                    <Typography sx={{ fontWeight: '600', fontSize: '24px', marginBottom: '0.5rem' }} variant="h5">Forget Password</Typography>
                    <Typography sx={{ fontSize: '16px' }} variant="h5" >Firstly verify email</Typography>

                    <TextField
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="email"
                        value={email}
                        placeholder="Enter  Your Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* <TextField type="text" placeholder="Enter  Your Email" onChange={(e) => setEmail(e.target.value)} */}
                    {/* style={{ borderColor: emailError ? 'red' : '' }} /> */}
                    {emailError && <p style={{ color: 'red' }} className="error-message">{emailError}</p>}
                    {/* </div> */}
                    {/* <div className="col-12 my-2"> */}
                    <a href>
                        <button type='submit' className="bg-orange btn" onClick={handleSubmit}>Get Otp </button>
                    </a>
                    {/* </div> */}
                    <div>
                        <p style={{ color: 'red' }}>{message}</p>
                    </div>
                    {/* <div className="col-12 my-2"> */}
                    {/* <p className="lh-md text-center text-light">
                        By Continuing You agree to out <span style={{ color: '#ffb900', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/RegisterLegalPage')}> Legal Terms</span> and you are 18 years of older.
                    </p> */}
                    {/* </div> */}
                    {/* <div className="col-12 my-2"> */}
                    <p className="lh-lg text-center " style={{ color: 'black' }}>
                        Don’t want to change password <span style={{ color: '#ffb900', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/')}> Login</span>
                    </p>
                    {/* </section > */}
                </div>
            </Container>
        </>
    )
}

export default ForgetEmail;