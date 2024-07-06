import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignUpPage from './SignUpPage';
import OTPInput from 'react-otp-input';
// export const baseURL = "https://misty-pelican.cyclic.cloud/api/v1"


import Logo from '../Logo.jsx';

import { baseURL } from '../../token';
import './Register.css'
import Swal from 'sweetalert2';
function RegisterPage() {
    
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secret, setSecret] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [referCode, setReferCode] = useState(queryParams.get('referral') ? queryParams.get('referral') : '');
    const [otpInputs, setOtpInputs] = useState('');
    const [showOtpFields, setShowOtpFields] = useState(false);
    const [resendTimer, setResendTimer] = useState(59);
    const [isOtpFieldsShown, setIsOtpFieldsShown] = useState(false);
    const [nameError, setNameError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [showEmailField, setShowEmailField] = useState(false);
    const [isGetOtpDisabled, setIsGetOtpDisabled] = useState(true); // Add state for Get OTP button
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleGetOtpClick = async () => {
        setMessage('');
        if (!name.trim()) {
            setNameError('Please enter your name');
            return;
        }
        if (!phoneNumber.trim()) {
            setPhoneNumberError('Please enter your phone number');
            return;
        }
        if (phoneNumber.length !== 10) {
            setPhoneNumberError("The phone number should be of length 10");
            return;
        }
        if (password.length < 8) {
            setPasswordError("The password should be of length 8");
            return;
        }

        try {
            const queryParams = {
                mode: "phone",
            };
            console.log("otpmode", queryParams.mode)

            const requestBody = {
                Password: password,
                Phone: phoneNumber,
                Email: email,
                referral: referCode,
                Name: name
            };

            const response = await axios.post(baseURL + '/register', requestBody, {
                params: queryParams,
            });

            if (response?.data?.status == 200) {
                setSecret(response?.data?.secret)
                startTimer();
                setShowOtpFields(true);
                setIsVerifying(true);
                setIsOtpFieldsShown(true);
            }
        } catch (err) {
            console.log(err?.response?.data?.message);
            setMessage(err?.response?.data?.message);
        }
    };

    const handleVerifyNumberClick = async () => {
        setMessage('');
        try {
            const queryParams = {
                mode: "phone"
            }
            const requestBody = {
                Phone: phoneNumber,
                twofactor_code: otpInputs,
                secretCode: secret,
                // role: 'basic'
            };
            const response = await axios.post(baseURL + '/verify-otp', requestBody, {
                params: queryParams,
            })

            if (response?.data?.status === 200) {
                // navigate(`/SignUpPage?name=${name}&phoneNumber=${phoneNumber}&email=${email}`);
                const signupData = {
                    name: name,
                    phoneNumber: phoneNumber,
                    email: email,
                }
                // const emailparams = {
                //     mode: "email"
                // }
                // const emailotp = await axios.post(baseURL + '/user/otp', requestBody, {
                //     params: emailparams,
                // });
                // console.log("otp sent on email");
                // const emailverify = await axios.post(baseURL + '/user/verify', requestBody, {
                //     params: emailparams,
                // })
                // console.log("email otp verified");
                setIsPhoneNumberVerified(true);
                setShowEmailField(true);
                setIsEmailVerified(true);
                setIsVerifying(false);
                setShowOtpFields(false);
                setIsGetOtpDisabled(true);
                Swal.fire({
                    icon: "success",
                    title: "Successfully",
                    text: "Account verify successfully.",
                });
                setTimeout(() => {
                    navigate(`/UserPage`, { state: signupData });
                    // localStorage.setItem('access_token', emailverify.data.data.accessToken);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
                    localStorage.setItem('access_token', response?.data?.token);
                    localStorage.setItem('access_token_expiration', expirationDate.toISOString());
                }, 2000)
            }
        }
        catch (err) {
            console.log(err?.response?.data?.message);
            // Enable the Get OTP button
            setMessage(err?.response?.data?.message);
        }
    };

    // Handle timer expiry
    const handleTimerExpiry = () => {
        if (!showOtpFields && resendTimer === 0) {
            // Perform the "Get OTP" functionality here
            // console.log("Performing Get OTP functionality");
            // handleGetOtpClick();
            // setIsGetOtpDisabled(false);
            clearInterval(interval)
        }
    };


    // const handleResendClick = (e) => {
    //     e.preventDefault();
    //     console.log("heyy");
    //     setResendTimer(29);
    //     startTimer();
    //     // e.preventDefault();
    //     // // if (resendTimer === 0) {
    //     // // Call the startTimer function to restart the timer
    //     // }
    // };

    const handleResendClick = async (e) => {
        e.preventDefault();
        // console.log("heyy");
        // clearInterval(interval);


        // Set the timer to 29 first
        setResendTimer(59);
        const response = await axios.post(baseURL + '/resend-otp', { Phone: phoneNumber });

        if (response?.data?.status == 200) {

            startTimer();
            setSecret(response?.data?.secret)
            setShowOtpFields(true);
            setIsVerifying(true);
            setIsOtpFieldsShown(true);
        }        // Wait for a brief moment (e.g., 100ms) before starting the timer
        // await new Promise((resolve) => setTimeout(resolve, 10));
        // // Now start the timer
        // startTimer();
    };

    var interval
    var clearTimer = false;
    const startTimer = () => {
        let timer = 59; // Set the initial timer value
        interval = setInterval(() => {
            timer--;
            if (timer <= 0) {
                // Timer has reached 00:00, so clear the interval and show the resend OTP button
                clearInterval(interval);
                setResendTimer(0);
            } else {
                // Update the timer value
                setResendTimer(timer);
            }
        }, 1000);
    };

    useEffect(() => {
        setIsGetOtpDisabled(
            !name.trim() ||
            !phoneNumber.trim() &&
            !email.trim() ||
            (showEmailField && !email)
        );
    }, [name, phoneNumber, email]);

    const handleInputChange = (otp) => {

        setOtpInputs(otp);
        setMessage('')
    };

    return (
        <>
            <section id="main-bg">
                <div id="register-container" className="container mx-0">
                    <>
                        <div className="row " id="register">
                            <div className="card h-100 p-0">
                                <h4 className="text-center py-2">Register</h4>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 my-2">
                                            <input
                                                type="text"
                                                placeholder="Enter Your Name"
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={isOtpFieldsShown} // Disable the input field if OTP fields are shown
                                            />
                                        </div>
                                        {nameError && <p style={{ color: 'red' }} > {nameError} </p>}
                                        <div className="col-12 my-2">
                                            <input
                                                type="text"
                                                placeholder="Phone number"
                                                disabled={isPhoneNumberVerified} // Disable the input field if OTP fields are shown
                                                onChange={(e) => {
                                                    setPhoneNumber(e.target.value); if (e.target.value.length === 10) {
                                                        setPhoneNumberError('')
                                                    }
                                                }} />
                                        </div>
                                        {phoneNumberError && <p style={{ color: 'red' }}>{phoneNumberError}</p>}
                                        {/* {showEmailField && ( */}
                                        <div className="col-12 my-2">
                                            <input
                                                type="text"
                                                placeholder="E-mail"
                                                onChange={(e) => {
                                                    setEmail(e.target.value)
                                                }}
                                            />
                                        </div>
                                        {/* )} */}
                                        <div className="col-12 my-2">
                                            <input
                                                type="number"
                                                value={referCode} 
                                                disabled={queryParams.get('referral') ? true : false}
                                                placeholder="Refer Code( optional )"
                                                onChange={(e) => setReferCode(e.target.value)} />
                                        </div>
                                        <div className="col-12 my-2">
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                onChange={(e) => {
                                                    setPassword(e.target.value); if (e.target.value.length > 8) {
                                                        setPasswordError('')
                                                    }
                                                }} />
                                        </div>
                                        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                                        {showOtpFields ? (
                                            <>
                                                <div className="col-12 d-flex otp-input">
                                                    <div className="otpElements">
                                                        {/* <p className="p3" style={{ color: 'black', fontWeight: '700' }}>Enter your OTP here*</p> */}
                                                        <div className="otp">
                                                            <OTPInput
                                                                onChange={handleInputChange}
                                                                value={otpInputs}
                                                                inputStyle="inputStyle"
                                                                numInputs={6}
                                                                separator={<span></span>}
                                                                renderInput={(props) => <input {...props} />}
                                                            />
                                                        </div>

                                                        <div style={{ alignItems: 'centers', paddingTop: "20px" }} className="my-auto col-12">
                                                            <div className="row">
                                                                <div style={{ fontSize: '12px' }} className="d-flex col-6 justify-content-start my-2 text-light">
                                                                    Resend in {resendTimer < 10 ? `00:0${resendTimer}` : `00:${resendTimer}`} seconds
                                                                  
                                                                </div>
                                                                
                                                                <div className="d-flex col-6 justify-content-end my-2">
                                                                    {resendTimer === 0 && (
                                                                        <button className="btn btn-success ms-2" onClick={(e) => { setResendTimer(59); handleResendClick(e); }}>
                                                                            Resend OTP
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p style={{ fontSize: '20px',color:"#b76ad0 !important" }} className='text-light'>Please enter OTP code <span style={{fontWeight:"650"}}>835769</span></p>
                                                        </div>
                                                    </div>
                                                    {/* <div className="card card-body p-0 mx-1">
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
                                                <div className="card card-body p-0 mx-1">
                                                    <input
                                                        className="border rounded p-2 text-center otp-input"
                                                        id="otp5"
                                                        type="text"
                                                        value={otpInputs[4]}
                                                        onChange={(e) => handleInputChange(4, e.target.value)}
                                                        maxLength={1}
                                                        style={{ outline: 'none', border: 'none', width: '100%' }}
                                                    />
                                                </div>
                                                <div className="card card-body p-0 mx-1">
                                                    <input
                                                        className="border rounded p-2 text-center otp-input"
                                                        id="otp6"
                                                        type="text"
                                                        value={otpInputs[5]}
                                                        onChange={(e) => handleInputChange(5, e.target.value)}
                                                        maxLength={1}
                                                        style={{ outline: 'none', border: 'none', width: '100%' }}
                                                    />
                                                </div> */}

                                                </div>

                                                {/* <div style={{ alignItems: 'centers', paddingTop: "20px" }} className="my-auto col-12">
                                                    <div className="row">
                                                        <div style={{ fontSize: '12px' }} className="d-flex col-6 justify-content-start my-2 text-light">
                                                            Resend in {resendTimer < 10 ? `00:0${resendTimer}` : `00:${resendTimer}`} seconds
                                                        </div>
                                                        <div className="d-flex col-6 justify-content-end my-2">
                                                            {resendTimer === 0 && (
                                                                <button className="btn btn-success ms-2" onClick={(e) => { setResendTimer(59); handleResendClick(e); }}>
                                                                    Resend OTP
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </>

                                        ) : null}

                                        <p style={{ color: 'red' }}>{message}</p>
                                        <div className="col-12 my-2">
                                            {isVerifying ? (
                                                <>
                                                    <button className="bg-orange btn" onClick={() => {
                                                        handleVerifyNumberClick()
                                                    }}>
                                                        {/* {isEmailVerified ? "Verify Email" : "Verify Number"} */}
                                                        Verify Number
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="bg-orange btn"
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Add this line to prevent the default behavior
                                                            handleGetOtpClick(e);
                                                        }} disabled={isGetOtpDisabled}
                                                    >
                                                        Get OTP
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div className="col-12 my-2">
                                            <p className="lh-lg text-center text-light">
                                                By Continuing You agree to out<span style={{ color: '#ffb900', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/RegisterLegalPage')}> Legal Terms</span> and you are 18 years of older.
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
            </section >
        </>
    )
}

export default RegisterPage;