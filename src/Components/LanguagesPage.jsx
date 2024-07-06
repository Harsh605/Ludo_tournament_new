import React from 'react'
import HeaderComponent from './HeaderComponent';
import Logo from './Logo';

function LanguagesPage() {
    return (
        <>
            <section id="main-bg">
                <div id="language-container" className="container  mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent />
                        </div>
                    </div>
                    <div className="row   d-flex justify-content-center" id="language">
                        <div className="card mt-5 h-100 p-0">
                            <h4 className="text-center py-2">Language</h4>
                            <div className="card-body">
                                <div className="row">
                                    <form action>
                                        <div className="form-check my-2 align-items-center d-flex">
                                            <div id="radio-div">
                                                <input type="radio" name="Language" id="radio" defaultValue="Hindi" />
                                            </div>
                                            <label className="text-white px-2 " htmlFor="Hindi">Hindi</label>
                                        </div>
                                        <div className="form-check  my-2 align-items-center d-flex">
                                            <div id="radio-div">
                                                <input type="radio" name="Language" id="radio" defaultValue="English" defaultChecked />
                                            </div>
                                            <label className=" text-white px-2" htmlFor="English">English</label>
                                        </div>
                                        <div className="col-12 my-4">
                                            <a href>
                                                <button className="bg-orange btn">SUBMIT</button>
                                            </a>
                                        </div>
                                    </form>
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

export default LanguagesPage;