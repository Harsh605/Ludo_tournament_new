import React from 'react'
// import "./bootstrap.css";
// import "./style.css";
import UserSection from './UserSection';
import { Route, Routes } from 'react-router-dom';



function UserPage() {
    return (
        <>
            <section id="main-bg">
                <div id="navbar-container" className="container mx-0">
                    <div className="row">
                        <UserSection />
                    </div>
                </div>
            </section>

        </>
    )
}

export default UserPage;





// import React, { useState } from 'react'

// import "./bootstrap.css"
// import "./style.css";

// function UserPage() {
//     const [profileInfo] = useState({
//         name: 'Dominic',
//         membershipStatus: 'Pro member',
//         profileId: 'abcd678'
//     });
//     const navItems = [
//         { icon: 'casino', title: 'Play', link: 'play.html' },
//         { icon: 'wallet', title: 'Wallet', link: 'wallet.html' },
//         { icon: 'history', title: 'History', link: 'history.html' },
//         { icon: 'account_circle', title: 'Profile', link: 'profile.html' },
//         { icon: 'payments', title: 'Refer and Earn', link: 'referandearn.html' },
//         { icon: 'emoji_events', title: 'Spin and Win', link: 'spinwin.html' },
//         { icon: 'translate', title: 'Language', link: 'language.html' },
//         { icon: 'support_agent', title: 'Support', link: 'support.html' },
//         { icon: 'gavel', title: 'Legal Terms', link: 'legalterms.html' },
//     ];
//     return (
//         <>
//             <section id="main-bg">
//                 <div id="navbar-container" className="container mx-0">
//                     <div className="row">
//                         <div className="col-12 d-flex align-items-center justify-content-end pe-0" id="nav-head">
//                             <div id="profile-img-bg" className="rounded-circle">
//                                 <img src="../images/img.jpg" className="rounded-circle" style={{ width: '100%' }} alt="" />
//                             </div>
//                             <div id="profile-info-bg">
//                                 <h5 className="text-light pt-2 mb-0 ms-5">{profileInfo.name}</h5>
//                                 <p className="text-light ms-5 mb-0">{profileInfo.membershipStatus}</p>
//                                 <h6 className="text-light ms-5 rounded-pill " id="profile-id">{profileInfo.profileId}</h6>
//                             </div>
//                         </div>

//                         {navItems.map((item, index) => (
//                             <a href={item.link} className="nav-link" key={index}>
//                                 <div className="col-12 d-flex justify-content-between text-light p-2 nav-item ">
//                                     <div className="d-flex align-items-center">
//                                         <span className="material-symbols-outlined me-2">{item.icon}</span>
//                                         <h4 className="mb-0">{item.title}</h4>
//                                     </div>
//                                     <div className="d-flex align-items-center">
//                                         <span className="material-symbols-outlined"></span>
//                                     </div>
//                                 </div>
//                             </a>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//         </>
//     )
// }

// export default UserPage