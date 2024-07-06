import React from 'react';
// import "./bootstrap.css";
// import "./style.css";
import HeaderComponent from '../HeaderComponent';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { useState } from 'react';
import { useEffect } from 'react';
import { handleUnAuthorized } from '../hooks/handleUnAuthorized';
import axios from 'axios';
import { baseURL } from '../../token';

function WalletPage() {

    const navigate = useNavigate();

    const [user, setUser] = useState({})
    useEffect(() => {
        let access_token = localStorage.getItem('access_token');
        access_token = localStorage.getItem('access_token');
        if (!access_token) {
            window.location.reload()
            navigate("/LoginPage");
        }
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `/me`, { headers })
            .then((res) => {
                setUser(res.data)
            }).catch((e) => {
                console.log(e)
                handleUnAuthorized(e.response.status, navigate)
            })
    }, [])
    return (
        <section id="main-bg">
            <div id="wallet-container" className="container mx-0">
                <div className="row">
                    <div className="col-12">
                        <HeaderComponent userData={user} />
                    </div>
                    <div className="col-12 my-3">
                        <div className="row align-items-center my-2">
                            <div className="my-auto col-6 text-white" onClick={() => navigate('/UserPage')}>
                                <button type="button" className="btn btn-primary d-flex "><span className="material-symbols-outlined mb-0">arrow_back</span>Back</button>
                            </div>
                            <div className="col-6 d-flex justify-content-end">
                                <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="guide-btn" className="btn btn-outline-primary bg-light">Guide</button>
                                {/* Modal */}
                                <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Guide Vedio</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                            </div>
                                            <div className="modal-body">
                                                <iframe width="100%" height="350px" src="https://www.youtube.com/embed/38y_1EWIE9I" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12" style={{ display: 'block' }}>
                        {/* <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" id="guide-btn" className="btn btn-outline-primary bg-light">Guide</button> */}

                        {/* Modal */}
                        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel">KYC Details</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-6">
                                                <h6><strong>Name</strong></h6>
                                            </div>
                                            <div className="col-6">
                                                <h6 className="text-end">Dheeraj Meena</h6>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-6">
                                                <h6><strong>Dob</strong></h6>
                                            </div>
                                            <div className="col-6">
                                                <h6 className="text-end">30-07-0222</h6>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-6">
                                                <h6><strong>Gender</strong></h6>
                                            </div>
                                            <div className="col-6">
                                                <h6 className="text-end">M</h6>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-3">
                                                <h6><strong>Address</strong></h6>
                                            </div>
                                            <div className="col-9">
                                                <h6 className="text-end">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, laboriosam.</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 card mt-3 walletcard pt-2 px-0 mx-auto text-white">
                        <div className="text-center">Deposit Cash</div>
                        <div className="card-body walletbody mt-2">
                            <div className="card info-ludo col-12 text-center text-white p-3 mb-3">
                                Deposit Cash Info
                            </div>
                            <div className="my-auto">
                                <div className="text-center">
                                    <h4>Cash</h4>
                                </div>
                                <div className="text-center mb-1">
                                    <h4>{user.Wallet_balance?.toFixed(2)}</h4>
                                </div>
                            </div>
                            <div className="col-12" onClick={() => navigate('/AddChipsPage')} >

                                <button className="bg-orange btn">Add Cash</button>

                            </div>
                        </div>
                    </div>
                    <div className="col-12 card my-2 walletcard pt-2 px-0 mx-auto text-white">
                        <div className="text-center">Winning Cash</div>
                        <div className="card-body walletbody mt-2">
                            <div className="card info-ludo col-12 text-center text-white p-3 mb-3">
                                Winning Cash Info
                            </div>
                            <div className="my-auto">
                                <div className="text-center">
                                    <h4>Cash</h4>
                                </div>
                                <div className="text-center mb-1">
                                    <h4>{user?.withdrawAmount?.toFixed(2)}</h4>
                                </div>
                            </div>
                            <div className="col-12" onClick={() => navigate('/WithdrawPage')}>

                                <button className="bg-orange btn">Withdraw</button>

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
        </section>

    )
}

export default WalletPage;