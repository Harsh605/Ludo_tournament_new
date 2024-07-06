import React from 'react'
import HeaderComponent from '../Components/HeaderComponent';
import { useNavigate } from 'react-router-dom';
import Logo from '../Components/Logo';

function FirstGame() {
    const challenges = [
        { id: 1, amount: 50 },
        { id: 2, amount: 100 },
        { id: 3, amount: 150 },
        { id: 4, amount: 200 },
        { id: 5, amount: 250 },
        { id: 6, amount: 300 },
        { id: 7, amount: 350 },
        { id: 8, amount: 400 },
        { id: 9, amount: 450 },
        { id: 10, amount: 500 },
    ];
    const navigate = useNavigate();
    return (
        <>
            <section id="main-bg">
                <div id="challenge-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent />
                        </div>
                        <div className="col-12 my-3">
                            <button
                                type="button"
                                className="btn btn-primary d-flex "
                                onClick={() => navigate('/PlayPage')}
                            >
                                <span className="material-symbols-outlined mb-0">arrow_back</span>Back
                            </button>
                        </div>
                        {challenges.map(challenge => (
                            <div className="col-12 card my-1 walletcard pt-2 px-0 mx-auto text-white" key={challenge.id}>
                                <h6 className="mx-2">Currently Playing:2064</h6>
                                <div className="card-body walletbody mt-2">
                                    <div className="row">
                                        <div className="col-12 d-flex justify-content-between">
                                            <div className="d-flex">
                                                <img src="./images/challenge-cup.png" className="mx-2 cup-img" alt="" />
                                                <label className="mt-1"><strong> Rs {challenge.amount}</strong></label>
                                            </div>
                                            <div>
                                                <button className="btn bg-orange" onClick={() => navigate('/EnterFirstGame')}>Play</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}

                    </div>

                    {/* Modal */}
                    <div className="modal fade" id="exampleModal1" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog  modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="modal-title fs-5" id="exampleModalLabel">
                                        <h5><strong>Room Code:</strong>233455</h5>
                                        <h5><strong>Your Result:</strong> I Won</h5>
                                    </div>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-12   pt-2 px-0 mx-auto text-white d-flex justify-content-center">
                                            <div className="card-body card  mx-2 walletcard mt-2">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <img src="./images/img.jpg" className="rounded-circle mx-1 " style={{ width: '25%' }} alt />
                                                    </div>
                                                    <div className="col-4 d-flex justify-content-center">
                                                        <img src="./images/versus.png" className="rounded-circle mx-1" style={{ width: '25%' }} alt />
                                                    </div>
                                                    <div className="col-4 d-flex justify-content-end">
                                                        <img src="./images/img.jpg" className="rounded-circle mx-1" style={{ width: '25%' }} alt />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-4">
                                                        <p className="text-light">Avni</p>
                                                    </div>
                                                    <div className="col-4 d-flex justify-content-center">
                                                        <p className="text-success text-end"><strong> Rs 50</strong></p>
                                                    </div>
                                                    <div className="col-4 d-flex justify-content-end">
                                                        <p className="text-light text-end">Avni</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 my-3 d-flex justify-content-center">
                                            <img src="./images/ludo 2.png" style={{ width: '80%' }} alt />
                                        </div>
                                        <div className="col-12">
                                            <p className="text-center">
                                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet dolores eaque nobis libero molestias. Delectus culpa perspiciatis temporibus atque deleniti, laboriosam ipsum officiis fuga.
                                            </p>
                                        </div>
                                    </div>
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

        </>
    )
}

export default FirstGame;