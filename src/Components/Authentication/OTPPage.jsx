import React from 'react'
import { useNavigate } from 'react-router-dom';

function OTPPage() {
    const navigate = useNavigate();
    return (
        <>
            <section id="main-bg">
                <div id="verify-container" className="container mx-0">
                    <div className="row ">
                        <div className="col-12 card mt-5 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="text-center">Verify Phone Number</div>
                            <div className="card-body walletbody mt-2">
                                <div className="mb-2 justify-content-start" onClick={() => navigate('/RegisterPage')}>
                                    
                                    <button type="button" id="guide-btn" className="btn btn-outline-primary bg-light">← Change
                                        Number</button>

                                </div>
                                <div className="col-12 d-flex my-2">
                                    <div className="card card-body p-0 mx-1">
                                        <input className="border rounded text-center otp-input" id="otp1" type="text" maxLength={1} style={{ outline: 'none', border: 'none', width: '100%' }} />
                                    </div>
                                    <div className="card card-body p-0 mx-1">
                                        <input className="border rounded text-center otp-input" id="otp2" type="text" maxLength={1} style={{ outline: 'none', border: 'none', width: '100%' }} />
                                    </div>
                                    <div className="card card-body p-0 mx-1">
                                        <input className="border rounded text-center otp-input" id="otp3" type="text" maxLength={1} style={{ outline: 'none', border: 'none', width: '100%' }} />
                                    </div>
                                    <div className="card card-body p-0 mx-1">
                                        <input className="border rounded text-center otp-input" id="otp4" type="text" maxLength={1} style={{ outline: 'none', border: 'none', width: '100%' }} />
                                    </div>
                                    <div className="card card-body p-0 mx-1">
                                        <input className="border rounded text-center otp-input" id="otp5" type="text" maxLength={1} style={{ outline: 'none', border: 'none', width: '100%' }} />
                                    </div>
                                    <div className="card card-body p-0 mx-1">
                                        <input className="border rounded text-center otp-input" id="otp6" type="text" maxLength={1} style={{ outline: 'none', border: 'none', width: '100%' }} />
                                    </div>
                                </div>
                                <div className="my-auto col-12">
                                    <div className="row">
                                        <div className="d-flex col-6 justify-content-start my-2">Resend in 00:00 seconds</div>
                                        <div className="d-flex col-6 justify-content-end my-2">
                                            <button className="btn btn-success">Resend OTP</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 text-center p-2">
                                    By Continuing, you agree to our <a href="legalterms1.html">Legal Terms</a> and you are 18 years or older.
                                </div>
                                <div className="col-12">
                                    <a href>
                                        <button className="bg-orange btn">Verify</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default OTPPage;