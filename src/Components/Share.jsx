import React, { useState } from 'react'


import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    WhatsApp as WhatsAppIcon,
    Instagram as InstagramIcon,
} from '@mui/icons-material';
import { Button } from '@mui/material';

import { IconButton, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FileCopy, Share } from '@mui/icons-material';
import HeaderComponent from './HeaderComponent';
import Logo from './Logo';
import { useEffect } from 'react';
import { baseURL } from '../token';
import axios from 'axios';
import Swal from 'sweetalert2';

const SharePage = () => {
    const [activeCard, setActiveCard] = useState(null);
    const [enable, setEnable] = useState(false);
    const [linkToCopy, setLinkToCopy] = useState('https://khelludokhel.info/#/RegisterPage');
    // const [linkToCopy, setLinkToCopy] = useState('http://localhost:3002/#/RegisterPage');
    const [showDialog, setShowDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [userData, setUserData] = useState({});
    const [settingData, setWebsiteSettings] = useState({});
    const [game, setGame] = useState();

    const handleCardClick = (cardNumber) => {
        setEnable(!enable)
        setActiveCard(cardNumber);
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText(userData?.referral_code);
        Swal.fire({
            position: "center",
            icon: "success",
            type: "success",
            title: "Refer Code Copied",
            showConfirmButton: false,
            timer: 1200,
        });
        // You can add a message or UI feedback here to indicate that the link has been copied.
    };
    const handleCopyUrlLink = () => {
        navigator.clipboard.writeText(linkToCopy + '?referral=' + userData?.referral_code);
        Swal.fire({
            position: "center",
            icon: "success",
            type: "success",
            title: "Refer Code Copied",
            showConfirmButton: false,
            timer: 1200,
        });
        // You can add a message or UI feedback here to indicate that the link has been copied.
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const fetchData = async () => {
        let access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        axios
            .get(baseURL + `/settings/data`, { headers })
            .then((res) => {

                setWebsiteSettings(res);
            })
            .catch((e) => {
                alert(e.msg);
            });
    };

    const Allgames = async (id) => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        await axios
            .get(baseURL + `/referral/code/${id}`, { headers })
            .then((res) => {
                setGame(res.data);

            });
    };

    const MyData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const responsedetails = await axios.get(baseURL + '/me', {
                headers: headers,
            });
            Allgames(responsedetails.data.referral_code);
            setUserData(responsedetails.data);
        } catch (error) {
            console.error(error);
        }
    };

    console.log(">>>>>>>>>>>>>>>>>>", userData, game)

    useEffect(() => {
        MyData()
        fetchData()
    }, [])

    return (
        <>
            <section id="main-bg">
                <div id="legalterms-container" className="container mx-0">


                    <div className="row">
                        <div className="col-12 mb-5">
                            <HeaderComponent userData={userData} />
                        </div>

                        <div className='border text-white text-center' style={{ backgroundColor: '#6f42c1', fontWeight: "700", marginLeft: '0.5rem', marginRight: '0.5rem', width: '33rem' }}>Your Referral Earnings</div>
                        <div className="row border ml-0" style={{ height: '4.5rem', marginLeft: '0.5rem', marginRight: '0.5rem', width: '33rem' }}>
                            <div className="col-6 text-white text-center d-flex justify-content-center" style={{ borderRight: "1px solid white" }}>
                                <div className='mt-2 '>Referred Players</div>
                                <div className='' style={{ marginLeft: "-4rem", marginTop: '2.5rem' }}>{game}</div>
                            </div>
                            <div className="col-6 object-fit-contain text-white text-center d-flex justify-content-center" style={{ borderLeft: "1px solid white" }}>
                                <div className='mt-2 '>
                                    Referral Earning
                                </div>
                                <div className='' style={{ marginLeft: "-4rem", marginTop: '2.5rem' }}>₹{userData?.referral_earning}</div>

                            </div>
                        </div>
                        <div className='border mt-4 text-white text-center' style={{ backgroundColor: '#6f42c1', fontWeight: "700", marginLeft: '0.5rem', marginRight: '0.5rem', width: '33rem' }}>Referral Code
                        </div>
                        <div className="row border ml-0 mb-3" style={{ marginLeft: '0.5rem', marginRight: '0.5rem', width: '33rem'}}>

                            <div className="col-12 object-fit-contain text-center d-flex justify-content-center">
                                <img id="support-img" src="./refer-image.webp" alt />
                            </div>
                            <div className='mb-3'>
                                <div className="input-group mb-0" style={{ transition: 'top 0.5s ease 0s', top: '5px' }}>

                                    <input className="form-control h-auto mt-3 mb-1" name="password" type="tel" placeholder="Your Code" value={userData?.referral_code} disabled
                                        // onChange={(e) => settwofactor_code(e.target.value)}
                                        style={{ transition: 'all 3s ease-out 0s', borderRadius: "4px", border: '1px solid #d8d6de', fontSize: '14px', fontWeight: '600' }} />
                                    <div className="input-group-prepend mt-3 mb-1">
                                        <div className=" btn rounded btn-primary" onClick={handleCopyLink}>Copy</div>
                                    </div>
                                </div>
                                <div className="input-group mb-2" style={{ transition: 'top 0.5s ease 0s', top: '5px' }}>

                                    <input className="form-control h-auto my-3" name="password" type="tel" placeholder="Your Code" value={linkToCopy + '?referral=' + userData?.referral_code} disabled
                                        // onChange={(e) => settwofactor_code(e.target.value)}
                                        style={{ transition: 'all 3s ease-out 0s', borderRadius: "4px", border: '1px solid #d8d6de', fontSize: '14px', fontWeight: '600' }} />
                                    <div className="input-group-prepend my-3">
                                        <div className=" btn rounded btn-primary" onClick={handleCopyUrlLink}>Copy</div>
                                    </div>
                                </div>
                                {/* <button
                                    style={{ marginBottom: "1" }}
                                    className="col-12 btn rounded btn-primary my-3  d-flex justify-content-center"
                                    onClick={handleCopyLink}
                                    color="primary"
                                    aria-label="Copy Link"
                                >Copy Link
                                    <FileCopy />
                                </button> */}
                                {/* </a> */}


                                <button
                                    className="col-12 btn rounded btn-primary my-auto d-flex justify-content-center"
                                    onClick={handleOpenDialog}
                                    style={{ color: 'purple' }}
                                    aria-label="Share"
                                >
                                    <Share />
                                </button>
                            </div>
                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <DialogContent>
                                    <h4>Share Link</h4>
                                    <p>Share this link on:</p>
                                    <IconButton
                                        component="a"
                                        href={`https://www.facebook.com/sharer.php?u=${linkToCopy + '?referral=' + userData?.referral_code}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FacebookIcon />
                                    </IconButton>
                                    <IconButton
                                        component="a"
                                        href={`https://twitter.com/share?url=${linkToCopy + '?referral=' + userData?.referral_code}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <TwitterIcon />
                                    </IconButton>
                                    <IconButton
                                        component="a"
                                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(linkToCopy + '?referral=' + userData?.referral_code)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <WhatsAppIcon />
                                    </IconButton>
                                    <IconButton
                                        component="a"
                                        href={`https://www.instagram.com/share?url=${linkToCopy + '?referral=' + userData?.referral_code}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <InstagramIcon />
                                    </IconButton>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                    {/* <div className="col d-flex justify-content-between">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDialog(true)}
                            >
                                Share
                            </button>
                        </div> */}
                    {/* </div>
                        </div> */}


                    <div>
                        {/* <a className="text-center row my-2 mx-auto text-decoration-none"> */}
                        {/* <button className="col-12 btn rounded btn-primary my-auto d-flex justify-content-center"><span className="material-symbols-outlined">chat</span>Live Chat</button> */}


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
                </div>
            </section >
        </>
    )
}

export default SharePage;

// import React, { useEffect, useState } from "react";
// import css from "../styles/Refer.module.css";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// // import Header from "../Components/Header";
// import { baseURL } from "../token";
// // import 'remixicon/fonts/remixicon.css'

// const SharePage = () => {
//     const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
//     const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
//     const nodeMode = process.env.NODE_ENV;
//     if (nodeMode === "development") {
//         var baseUrl = beckendLocalApiUrl;
//     } else {
//         baseUrl = beckendLiveApiUrl;
//     }

//     const [user, setUser] = useState();
//     const [cardData, setGame] = useState([]);
//     const [WebSitesettings, setWebsiteSettings] = useState("");
//     const [refercommission, setrefercommission] = useState(1);

//     useEffect(() => {
//         Cashheader();
//         fetchData();
//         //eslint-disable-next-line
//     }, []);

//     const Cashheader = () => {
//         let access_token = localStorage.getItem("access_token");
//         const headers = {
//             Authorization: `Bearer ${access_token}`,
//         };
//         axios
//             .get(baseURL + `/me`, { headers })
//             .then((res) => {

//                 setUser(res.data);
//                 // console.log(res.data);
//                 setrefercommission(res.data.ref_Commision)
//                 Allgames(res.data.referral_code);
//             })
//             .catch((e) => {
//                 alert(e.msg);
//             });
//     };

//     const Allgames = async (id) => {
//         const access_token = localStorage.getItem("access_token");
//         const headers = {
//             Authorization: `Bearer ${access_token}`,
//         };
//         await axios
//             .get(baseURL + `/referral/code/${id}`, { headers })
//             .then((res) => {
//                 setGame(res.data);

//             });
//     };

//     const fetchData = async () => {
//         let access_token = localStorage.getItem("token");
//         const headers = {
//             Authorization: `Bearer ${access_token}`,
//         };
//         axios
//             .get(baseURL + `/settings/data`, { headers })
//             .then((res) => {

//                 return setWebsiteSettings(res);
//             })
//             .catch((e) => {
//                 alert(e.msg);
//             });
//     };

//     const copyCode = (e) => {
//         // console.log(Game.Room_code);
//         navigator.clipboard.writeText(user.referral_code);

//         Swal.fire({
//             position: "center",
//             icon: "success",
//             type: "success",
//             title: "Room Code Copied",
//             showConfirmButton: false,
//             timer: 1200,
//         });
//     };

//     if (user === undefined) {
//         return null;
//     }

//     return (
//         <>
//             {/* <Header user={user} /> */}
//             <div>
//                 <div className="leftContainer" style={{ height: "100vh" }}>
//                     <div className={`${css.center_xy} pt-5`}>
//                         <picture className="mt-1">
//                             <img
//                                 alt="img"
//                                 width="226px"
//                                 src={process.env.PUBLIC_URL + "Images/refer/refer.png"}
//                                 className="snip-img"
//                             />
//                         </picture>
//                         <div className="mb-1">
//                             <div className="font-15">
//                                 Earn now unlimited
//                                 <span aria-label="party-face">🥳</span>
//                             </div>
//                             <div className="d-flex justify-content-center">
//                                 Refer your friends now!
//                             </div>
//                             <div className="mt-3 text-center font-9">
//                                 Current Earning:
//                                 <b>{user.referral_wallet}</b>
//                                 <Link className="ml-2" to="/Redeem">
//                                     Redeem
//                                 </Link>
//                             </div>
//                             <div className="text-center font-9">
//                                 Total Earned:
//                                 <b>{user.referral_earning}</b>
//                             </div>
//                             <div className={`${css.progress}`}>
//                                 <div
//                                     className={`${css.progress_bar} ${css.progress_bar_striped} ${css.bg_success}`}
//                                     aria-valuenow={user.referral_earning}
//                                     aria-valuemax={10000}
//                                     style={{ width: `${(user.referral_earning * 100) / 10000}%` }}
//                                 ></div>
//                             </div>
//                             <div className="font-9">
//                                 <span>Max: ₹10,000</span>
//                                 <Link className="float-right" to="/update-pan">
//                                     Upgrade Limit
//                                 </Link>
//                             </div>
//                             <div className={`${css.text_bold} mt-3 text-center`}>
//                                 Your Refer Code: {user.referral_code}
//                                 <i
//                                     className="ri-clipboard-fill ml-2 "
//                                     style={{ fontSize: "20px", color: "#007bff" }}
//                                     onClick={(e) => copyCode(e)}
//                                 ></i>
//                             </div>

//                             <div className="d-flex justify-content-center">
//                                 Total Refers:&nbsp;
//                                 <b>{cardData && cardData}</b>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mx-3 my-3">
//                         <div className={`${css.font_11} ${css.text_bold}`}>
//                             Refer &amp; Earn Rules
//                         </div>
//                         <div className="d-flex align-items-center m-3">
//                             <picture>
//                                 <img
//                                     alt="img"
//                                     width="82px"
//                                     src={process.env.PUBLIC_URL + "Images/refer/giftbanner.png"}
//                                     className="snip-img"
//                                 />
//                             </picture>
//                             <div className={`${css.font_9} mx-3`} style={{ width: "63%" }}>
//                                 <div>
//                                     When your friend signs up on Our website or App from your
//                                     referral link,
//                                 </div>
//                                 <div className={`${css.font_8} ${css.c_green} mt-2`}>
//                                     You get
//                                     <strong> {refercommission} % Commission</strong>
//                                     on your
//                                     <strong> referral's winnings.</strong>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="d-flex align-items-center m-3">
//                             <picture>
//                                 <img
//                                     alt="img"
//                                     width="82px"
//                                     src={process.env.PUBLIC_URL + "Images/refer/banner.png"}
//                                     className="snip-img"
//                                 />
//                             </picture>
//                             <div className={`${css.font_9} mx-3`} style={{ width: "63%" }}>
//                                 <div>Suppose your referral plays a battle for ₹10000 Cash,</div>
//                                 <div className={`${css.font_8} ${css.c_green} mt-2`}>
//                                     You get
//                                     <strong> ₹100 Cash</strong>
//                                     <strong></strong>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className={`${css.refer_footer} pt-2 `}>
//                         <a
//                             href={`whatsapp://send?text=Play Ludo and earn ₹10000 daily. https://ludo-kavish.com/login/${user.referral_code}  Register Now, My refer code is ${user.referral_code}.`}
//                             style={{ width: "100%" }}
//                         >
//                             <button className="bg-green refer-button cxy w-100">
//                                 Share in Whatsapp
//                             </button>
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SharePage;
