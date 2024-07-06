import React, { useRef, useState } from 'react'
import HeaderComponent from './HeaderComponent';
import { useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../token';

function ReferandEarn() {
    const referralInputRef = useRef(null);
    const [userData, setUserData] = useState({});
    const [buttonText, setButtonText] = useState('Copy'); // Default button text
    const [buttonTextColor, setButtonTextColor] = useState(' white'); // button k text ka color chnage kr ne k liye 

    const [referralData, setReferralData] = useState({
        referredPlayers: 125,
        referralEarnings: 3421,
    });

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

    const copyToClipboard = () => {
        // Select the input text
        referralInputRef.current.select();
        referralInputRef.current.setSelectionRange(0, 99999); // For mobile devices
        setButtonText('Copied');
        setButtonTextColor('green')
        // Copy the text to the clipboard
        document.execCommand('copy');
        // Deselect the input
        referralInputRef.current.setSelectionRange(0, 0);
        setTimeout(() => {
            setButtonText('Copy');
            setButtonTextColor('green');
        }, 2000);
    };

    const shareOnWhatsApp = () => {
        const referralCode = referralInputRef.current.value;
        const message = `Hey, check out this referral code: ${referralCode}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    useEffect(()=> {
        MyData()
    }, [])
    return (
        <section id="main-bg">
            <div id="refer-container" className="container mx-0">
                <div className="row">
                    <div className="col-12">
                        <HeaderComponent userData={userData} />
                    </div>
                    <div className="col-12 p-2 mt-1 d-flex justify-content-center">
                        <div className="card walletcard text-white text-center px-0">
                            <p className="mt-2">Your Refferal Earnings</p>
                            <div className="card-body profilecard text-center align-items-center justify-content-center">
                                <div className="row">
                                    <div className="col-6 text-center border-end">
                                        Reffered Players<br />{referralData.referredPlayers}
                                    </div>
                                    <div className="col-6 border-left-1">
                                        Refferal Earning<br />{referralData.referralEarnings}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 p-2 mt-1 d-flex justify-content-center">
                        <div className="card walletcard text-white text-center px-0 my-1">
                            <p className="mt-2">Refferal Code</p>
                            <div className="card-body profilecard text-center align-items-center justify-content-center">
                                <div className="row">
                                    <div className="col-12 object-fit-contain text-center mb-4">
                                        <img className="mw-100" src="./images/Refer.png" alt />
                                    </div>
                                    <div className="col-12 mb-4 d-flex justify-content-center">
                                        <input ref={referralInputRef} id="amount-input" className="text-yellow" readOnly type defaultValue={1234567} />
                                        <button id="amount-btn" className="text-light" onClick={copyToClipboard} style={{ color: buttonTextColor }}>{buttonText}</button>
                                    </div>
                                    <h5 className="my-3">OR</h5>
                                </div>
                                <span className="text-center row my-3 mx-auto text-decoration-none">
                                    <button className="col-12 btn rounded btn-success my-auto" onClick={shareOnWhatsApp}>
                                        <i className="fa fa-whatsapp" /> Share On Whatsapp
                                    </button>
                                </span>
                                <a href="#" className="text-center row my-3 mx-auto text-decoration-none">
                                    <button className="col-12 btn rounded btn-secondary my-auto d-flex justify-content-center"><span className="material-symbols-outlined">content_paste</span> Copy To
                                        Clipboard</button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 p-2 mt-1 d-flex justify-content-center ">
                        <div className="card info-ludo text-white text-center px-0 m-1">
                            <p className="mt-2">How It Works</p>
                            <div className="card-body profilecard text-center align-items-center justify-content-center p-3">
                                <div className="border rounded-top p-2">
                                    You can refer and <b>Earn 2%</b> of your referral winning, every time.
                                </div>
                                <div className="border rounded-bottom p-2">
                                    Like if your player plays for 10000 and wins, You will get 2200 as referral amount.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ReferandEarn;

// import React, { useEffect, useState } from "react";
// import css from "../css/Refer.module.css";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import Header from "../Components/Header";
// import { baseURL } from "../token";
// // import 'remixicon/fonts/remixicon.css'

// const ReferandEarn = () => {
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
//             .get(baseURL + `me`, { headers })
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
//             .get(baseURL + `referral/code/${id}`, { headers })
//             .then((res) => {
//                 setGame(res.data);

//             });
//     };

//     const fetchData = async () => {
//         const response = await fetch(baseURL + "settings/data");
//         const data = await response.json();
//         return setWebsiteSettings(data);
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
//             <Header user={user} />
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

// export default ReferandEarn;
