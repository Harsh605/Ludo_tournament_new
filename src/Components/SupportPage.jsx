import React from 'react'
import HeaderComponent from './HeaderComponent';
import Logo from './Logo';
import { useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../token';
import { useState } from 'react';
function SupportPage() {
    const [userData, setUserData] = useState()
    const MyData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const responsedetails = await axios.get(baseURL + '/me', {
                headers: headers,
            });
            setUserData(responsedetails.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        MyData()
    }, [])
    return (
        <>
            <section id="main-bg">
                <div id="support-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent userData={userData} />

                        </div>
                        {/* <div className="col-12">
        <div className="card container border border-danger mt-3 kycbox text-danger">
         
            <div style={{width:'100%'}} className=" my-auto col-6">
                    <h6 style={{lineHeight:'1.6'}}>KYC Pending Do not share OTP with anyone. Our team does not request OTP for any task. If you provide OTP to anyone, you yourself will be held responsible 🙏 </h6>
            </div>
            
          
        </div>
      </div> */}
                        {/* <div className="col-12" style={{display: 'none'}}>
        <div className="card container border border-success mt-2 kycbox text-success">
          <div className="row align-items-center my-2">
            <div className=" my-auto col-6">
              <p className="mb-0">KYC status </p>
              <div className="d-flex">
                <h6><strong>Verified</strong></h6>
                <span className="material-symbols-outlined">check_circle</span>
              </div>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-success float-right">View Kyc Details</button>
            </div>
          </div>
        </div>
        
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> */}
                        <div className="col-12 object-fit-contain text-center">
                            <img id="support-img" src="./images/Support.png" alt />
                        </div>
                    </div>
                    <a href="#" className="text-center row my-2 mx-auto text-decoration-none">
                        <button className="col-12 btn rounded btn-primary my-auto d-flex justify-content-center"><span className="material-symbols-outlined">chat</span>Live Chat</button>
                    </a>
                    <a href="#" className="text-center row my-2 mx-auto text-decoration-none">
                        <button className="col-12 btn rounded my-auto instabtn"><strong className="text-light"> <i className="fa fa-instagram" /> Connect On Instagram</strong></button>
                    </a>
                    <a href="#" className="text-center row my-2 mx-auto text-decoration-none">
                        <button id="guide-btn" className="btn btn-outline-primary bg-light my-auto"><i className="fa fa-envelope" /> Reach Us Via Email</button>
                    </a>
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

export default SupportPage;