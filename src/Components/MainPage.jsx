import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {

    const navigate = useNavigate();
    return (
        <>
            <section id="main-bg">
                <div style={{ height: '300vh', paddingBottom: '20rem' }} id="index-container" className=" mx-0">
                    <div id="index-nav" className="row py-2  align-items-center">
                        <div className="col-7 text-light "><strong><i className="bi bi-arrow-down-circle-fill" />&nbsp;Download App</strong></div>
                        <div className="col-5 d-flex justify-content-end text-light btn " >
                            <div style={{ marginRight: "1em" }} onClick={() => navigate('/LoginPage')}><strong>Login&nbsp;<i className="bi bi-person-circle" /></strong></div>
                            <div onClick={() => navigate('/RegisterPage')}><strong>Register&nbsp;<i className="bi bi-person-circle" /></strong></div>
                        </div>
                    </div>
                    <div className="col-12  ">
                        <div className="col=12 d-flex justify-content-center">
                            <img style={{ width: '250px' }} id="image-dice" src="./images/ludo 2.png" className="card-img-top" alt />
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                            {/* <img style={{ width: '250px' }} id="image-winner" src="./images/winner.png" className="card-img-top" alt /> */}
                            <img style={{ width: '250px' }} id="image-winner" src="./images/logo.png" className="card-img-top" alt />
                        </div>
                        <div className="col-12">
                            <h4 className="text-light text-center" id="play-tag">Play, Win, Flourish</h4>
                            <h6 className="text-light text-center"><strong id="win-tag">WIN UPTO 1 LAC</strong></h6>
                        </div>
                    </div>
                </div>
            </section >
        </>
    )
}

export default MainPage;