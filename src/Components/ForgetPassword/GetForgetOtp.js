import React from 'react'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../Logo.jsx';
import { baseURL } from '../../token.js';
import OTPInput from 'react-otp-input';
import Swal from 'sweetalert2';


const GetForgetOtp = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { state } = location;
    const [name, setName] = useState('');
    const [email, setEmail] = useState(state?.Phone ? state.Phone : '');
    const [password, setPassword] = useState('');
    const [secret, setSecret] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [cPasswordError, setCPasswordError] = useState('');
    const [referCode, setReferCode] = useState('');
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


    const handleResendClick = async (e) => {
        e.preventDefault();
        // console.log("heyy");
        // clearInterval(interval);


        // Set the timer to 29 first
        setResendTimer(59);
        const response = await axios.post(baseURL + '/resend-otp', { Phone: email });

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

    // Access the data from state or query parameters


    const handleInputChange = (otp) => {

        setOtpInputs(otp);
        setMessage('')
    };

    const handleSubmit = async () => {
        try {
            const body = {
                Phone: email,
                Password: password,
                secretCode: state.secret,
                twofactor_code: otpInputs
            }
            const response = await axios.post(baseURL + '/user/change-password', body)
            if(response.data.msg === "Invalid OTP") {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    type: "error",
                    title: "Invalid OTP",
                    showConfirmButton: true,
                    // timer: 1200,
                });
                return
            }
            if (response.data) {
                // localStorage.setItem('access_token', response.data.data.accessToken);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    type: "success",
                    title: "Password changed successfully.",
                    showConfirmButton: false,
                    timer: 1200,
                });
                navigate("/LoginPage")
            }
        } catch (error) {
            console.log(error);
            setMessage(error?.response?.data?.msg);
        }
    }


    return (

        <section id="main-bg">
            <div id="register-container" className="container mx-0">
                <>
                    <div className="row " id="register">
                        <div className="card h-100 p-0">
                            <h4 className="text-center py-2">Forget Password</h4>
                            <div className="card-body">
                                <div className="row">


                                    <>
                                        <div className="col-12 my-2">
                                            <input
                                                type="text"
                                                placeholder="Phone number"
                                                disabled={true} // Disable the input field if OTP fields are shown
                                                value={email}
                                            />
                                        </div>
                                        {phoneNumberError && <p style={{ color: 'red' }}>{phoneNumberError}</p>}
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
                                        <div className="col-12 my-2">
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                onChange={(e) => {
                                                    setCPassword(e.target.value); if (e.target.value.length > 8) {
                                                        setCPasswordError('')
                                                    }
                                                }} />
                                        </div>
                                        {cPasswordError && <p style={{ color: 'red' }}>{cPasswordError}</p>}
                                        <div className="col-12 d-flex otp-input">
                                            <div className="otpElements">
                                                <p className="p3" style={{ color: 'white', fontWeight: '700' }}>Enter OTP</p>
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
                                            </div>

                                        </div>


                                    </>
                                    <div className="col-12 my-2">
                                        <button
                                            className="bg-orange btn"
                                            onClick={handleSubmit}

                                        >
                                            Verify
                                        </button>

                                        <p style={{ color: 'red' }}>{message}</p>


                                    </div>
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
    )
}

export default GetForgetOtp