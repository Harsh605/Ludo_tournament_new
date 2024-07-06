import React, { useEffect, useRef, useState } from 'react'
import HeaderComponent from './HeaderComponent';
import { baseURL, token } from '../token';
import axios from 'axios';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleUnAuthorized } from './hooks/handleUnAuthorized';

// import "./bootstrap.css";
// import "./style.css";

function ProfilePage() {
    const [Id, setId] = useState(null)
    const [profile, setProfile] = useState({})
    const [holder_name, setHolder_name] = useState();
    const [account_number, setAccount_number] = useState();
    const [ifsc_code, setIfsc_code] = useState();
    const [upi_id, setUpi_id] = useState();

    const [frontLoaded, setfrontLoaded] = useState(null)
    const [backLoaded, setbackLoaded] = useState(null)
    const [Name, setName1] = useState()
    const [name, setName] = useState()
    const [Email, setEmail] = useState()
    const [Number, setNumber] = useState()
    const [DOB, setDob] = useState()
    const [referral, setReferral] = useState('')
    const [enable, setEnable] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    console.log('profile :>> ', profile);

    const fetchdata = () => {
        let access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `/me`, { headers })
            .then((res) => {
                setProfile(res.data)
                setId(res.data._id);
                // TotalGame(res.data._id);
                setName1(res.data.Name)
                setName(res.data.Name)
                setEmail(res.data.Email)
                setReferral(res.data.referral)
                setHolder_name(res.data.holder_name);
                setAccount_number(res.data.account_number);
                setIfsc_code(res.data.ifsc_code);
                setUpi_id(res.data.upi_id);
            }).catch((e) => {
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
                // alert(e.msg)
            })
    }
    useEffect(() => {
        fetchdata();
    }, [])
    const handleEdit = async () => {
        setEnable(false)
        // fetchdata();
    }
    const handleCancel = async () => {
        setEnable(true);
        // fetchdata();
    }
    // edit name
    const handleSave = async () => {
        setMessage('');
        try {
            const reqbody = {
                Name: name
            }
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const responsedetail = await axios.patch(baseURL + '/user/edit', reqbody, {
                headers: headers,
            });
            if (responsedetail) {
                if (responsedetail?.data === 'User name already exist!') {
                    Swal.fire({
                        icon: "error",
                        title: responsedetail?.data,
                        confirmButtonText: "OK",
                    });
                    return
                }
                // fetchdata();
                setEnable(true);
                setMessage("Name edited successfully.");
                setTimeout(() => setMessage(''), 2000);
            }
        } catch (error) {
            console.log(error);
            if (error.response.status == 401) {
                handleUnAuthorized(error.response.status, navigate)
            }
        }
    }

    const removeAccessToken = () => {
        return new Promise((resolve, reject) => {
            try {
                localStorage.removeItem('access_token');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    const removeExpirationToken = () => {
        return new Promise((resolve, reject) => {
            try {
                localStorage.removeItem('access_token_expiration');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    const handleLogout = () => {
        let access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.post(baseURL + `/logout`, {
            headers: headers
        }, { headers })
            .then((res) => {
                // setUser(res.data)
                localStorage.removeItem('access_token');
                localStorage.removeItem('access_token_expiration');
                navigate('/LoginPage')
                window.location.reload(true)
            }).catch((e) => {
                // alert(e.msg)
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
            })
    };

    let aadharProcess = useRef(false);


    const handleSubmitdata = (e) => {

        if (profile?.verified == "unverified") {

            if (aadharProcess.current === false) {
                aadharProcess.current = true;
                e.preventDefault();

                const formData = new FormData();

                formData.append("Name", Name);
                formData.append("Email", Email);
                formData.append("Number", Number);
                formData.append("DOB", DOB);
                formData.append("front", frontLoaded);
                formData.append("back", backLoaded);

                if (frontLoaded && backLoaded) {
                    const access_token = localStorage.getItem('access_token')
                    const headers = {
                        Authorization: `Bearer ${access_token}`,
                    }

                    axios.post(baseURL + `/aadharcard`, formData, { headers })
                        .then((res) => {

                            if (res.data.msg === false) {
                                Swal.fire({
                                    title: "Duplicate Entity",
                                    icon: "danger",
                                    confirmButtonText: "error",
                                });
                                setName('');
                                setEmail('');
                                setNumber('');
                                setDob('');
                                setfrontLoaded('');
                                setbackLoaded('');
                            }
                            else {
                                // navigate("/UserPage")
                                Swal.fire({
                                    title: "You Kyc form submitted",
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1200
                                });
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1200)
                            }
                            // console.log(res.data)
                            //
                            aadharProcess.current = false;
                        }).catch((e) => {

                            if (e.response.status == 401) {
                                handleUnAuthorized(e.response.status, navigate)
                            }
                        })
                }
                else {
                    aadharProcess.current = false;
                    alert('please fill all field')
                }
            }
            else {
                alert('You have submited request already.')
            }
        }
        else {
            alert('Your request in Process.')
        }
    }

    useEffect(() => {
        let access_token = localStorage.getItem('access_token');
        access_token = localStorage.getItem('access_token');
        if (!access_token) {
            window.location.reload()
            navigate("/LoginPage");
        }
        const frontPhoto = document.getElementById('frontPhoto');
        frontPhoto.onchange = e => {
            const [file] = frontPhoto.files;
            setfrontLoaded(file)
        }
        const backPhoto = document.getElementById('backPhoto');
        backPhoto.onchange = e => {
            const [file] = backPhoto.files;
            setbackLoaded(file)
        }
    }, [])

    // const handleLogout = async () => {
    //     const removalPromises = [
    //         new Promise((resolve) => {
    //             localStorage.removeItem('access_token');
    //             // localStorage.clear();
    //             setTimeout(resolve, 0);
    //         }),
    //         new Promise((resolve) => {
    //             localStorage.removeItem('access_token_expiration');
    //             // localStorage.clear();
    //             setTimeout(resolve, 0);
    //         }),
    //     ];
    //     await Promise.all(removalPromises);

    //     // await localStorage.removeItem('access_token');

    //     navigate('/LoginPage')
    // }
    return (
        <>
            <section id="main-bg">
                <div id="profile-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent userData={profile} />
                        </div>
                        <div className="col-12 card mt-3 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="text-center">Profile</div>
                            <div className="card-body walletbody mt-2">
                                <div className="row p-1">
                                    <div className="col-12 d-flex justify-content-center">
                                        <div id="profile-img-bg" className="rounded-circle">
                                            <img src="./images/img.jpg" className="rounded-circle mw-100" alt />
                                        </div>
                                    </div>
                                    <div className="col-12 my-2">
                                        <label htmlFor="name" className="text-left text-yellow">Name</label>
                                    </div>
                                    <div className="col-12 d-flex">
                                        <input style={{ textTransform: "capitalize" }} type="text" className="col-9 text-left d-flex details-1 " defaultValue="name" value={name}
                                            onChange={(e) => { setName(e.target.value) }}
                                            disabled={enable} />
                                        <a className="col-3 mx-1 d-flex justify-content-end text-decoration-none">
                                            {enable ?
                                                (<button className="bg-orange btn" onClick={handleEdit}>Edit</button>) :
                                                (<>
                                                    <div className='d-flex justify-content-center gap-2' style={{}}>

                                                        <button className="bg-orange btn " onClick={handleCancel}>Cancel</button>
                                                        <button className="bg-orange btn" onClick={handleSave}>Save</button>
                                                    </div>
                                                </>
                                                )}
                                        </a>
                                    </div>
                                    <p>{message}</p>
                                    <div className="col-12 my-2">
                                        <label htmlFor="mobile number" className="text-left text-yellow">Mobile Number</label>
                                    </div>
                                    <div className="col-12 my-1">
                                        <input type="number" className="col-12 text-left d-flex details" value={profile?.Phone} disabled />
                                    </div>

                                    <a className="text-center my-2 row mt-2 mx-auto text-decoration-none" onClick={handleLogout}>
                                        <button className="col-12 btn rounded btn-danger px-2">Logout</button>
                                    </a>
                                    <div className="col-12" style={{ display: 'block' }}>
                                        <div className="card container border border-success mt-2 kycbox">
                                            <div className="row align-items-center my-2">
                                                <div className=" my-auto col-6">
                                                    <p className="mb-0">KYC status </p>
                                                    <div className="d-flex">
                                                        <h6><strong><span className='text-error'>{profile?.verified?.charAt(0)?.toUpperCase() + profile?.verified?.slice(1)}</span></strong></h6>
                                                        {profile?.verified === 'verified' && <span className="material-symbols-outlined text-success">done</span>}
                                                        {profile?.verified === 'unverified' && <span className="material-symbols-outlined text-error" style={{ color: 'red' }}>close</span>}
                                                        {profile?.verified === 'pending' && <span className="material-symbols-outlined text-error" style={{ color: 'red' }}>pending</span>}

                                                    </div>
                                                </div>
                                                <div className="col-6 d-flex justify-content-end">
                                                    {/* {profile?.verified === 'verified' && <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-success float-right">View Kyc Details</button>} */}
                                                    {profile?.verified === 'unverified' && <button type="button" data-bs-toggle="modal" data-bs-target="#addKYC" className="btn btn-success float-right">Add Kyc</button>}

                                                </div>
                                            </div>
                                        </div>
                                        {/* Modal */}
                                        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content" style={{ color: 'black' }}>
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="exampleModalLabel">KYC Details</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                                    </div>
                                                    <div className="modal-body" >
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
                                                        </div><hr />
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <h6><strong>Gender</strong></h6>
                                                            </div>
                                                            <div className="col-6">
                                                                <h6 className="text-end">M</h6>
                                                            </div>
                                                        </div><hr />
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
                                        <div className="modal fade" id="addKYC" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content" style={{ color: 'black' }}>
                                                    <div className="modal-header">
                                                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add KYC Details</h1>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                                    </div>
                                                    <div className="modal-body" >
                                                        <form onSubmit={handleSubmitdata}>

                                                            <div className='row p-2' style={{ marginTop: "10px" }}>
                                                                <div className="kyc-doc-input border col-12">
                                                                    <div className="label">Name</div>
                                                                    <input type="text"
                                                                        className='col-12'
                                                                        style={{ border: '1px solid black', padding: '5px', marginBottom: '5px' }}
                                                                        name="Name"
                                                                        placeholder='Enter name'
                                                                        value={Name}
                                                                        disabled
                                                                        onChange={(e) => setName1(e.target.value)} required
                                                                    />
                                                                </div>
                                                                {/* <br /> */}
                                                                <div className="kyc-doc-input border col-12 mt-4">
                                                                    <div className="label">Email Id</div>
                                                                    <input type="text"
                                                                        className='col-12'
                                                                        style={{ border: '1px solid black', padding: '5px', marginBottom: '5px' }}
                                                                        name="Email"
                                                                        placeholder='Email Id'
                                                                        value={Email}
                                                                        disabled
                                                                        onChange={(e) => setEmail(e.target.value)} required
                                                                    />
                                                                </div>
                                                                <div className="kyc-doc-input border col-12 mt-4">
                                                                    <div className="label">Date of Birth</div>
                                                                    <input type="date"
                                                                        className='col-12'
                                                                        style={{ border: '1px solid black', padding: '5px', marginBottom: '5px' }}
                                                                        name="Name"
                                                                        placeholder='enter name'
                                                                        value={DOB}
                                                                        onChange={(e) => setDob(e.target.value)} required
                                                                    />
                                                                </div>
                                                                <div className="kyc-doc-input border col-12 mt-4">
                                                                    <div className="label">Aadhar Number</div>
                                                                    <input type="tel"
                                                                        className='col-12'
                                                                        style={{ border: '1px solid black', padding: '5px', marginBottom: '5px' }}
                                                                        name="Name"
                                                                        placeholder=' Aadhar Number'
                                                                        onChange={(e) => setNumber(e.target.value)} required
                                                                    />
                                                                </div>
                                                                <div className={`mt-4 mb-3 kyc-doc-input border col-12`}>
                                                                    <input id="frontPhoto" name="frontPhoto" type="file" accept="image/*" required />
                                                                    {!frontLoaded && <div className="cxy flex-column position-absolute">
                                                                        <img src="/images/file-uploader-icon.png" width="17px" alt="" className="snip-img" />
                                                                        <div className={` mt-2`}>
                                                                            Upload front Photo of your Aadhar Card.
                                                                        </div>
                                                                    </div>}
                                                                    {frontLoaded && <div >
                                                                        <img src="/images/file-icon.png" width="26px" alt="" style={{ marginRight: '20px' }} />
                                                                        <div className="d-flex flex-column" style={{ width: '80%' }}>
                                                                            <div >{frontLoaded.name}</div>
                                                                            <div >{(frontLoaded.size / 1024 / 1024).toFixed(2)} MB</div>
                                                                        </div>
                                                                        <div className="image-block">
                                                                            <img src="/images/global-cross.png" width="10px" alt="" onClick={() => setfrontLoaded(null)} />
                                                                        </div>
                                                                    </div>}
                                                                </div>
                                                                <div className={`kyc-doc-input border col-12 mt-4`}>
                                                                    <input id="backPhoto" name="backPhoto" type="file" accept="image/*" required />
                                                                    {!backLoaded && <div className="cxy flex-column position-absolute ">
                                                                        <img src="/images/file-uploader-icon.png" width="17px" alt="" className="snip-img" />
                                                                        <div className={`mt-2`}>
                                                                            Upload back Photo of your Aadhar Card.
                                                                        </div>
                                                                    </div>}
                                                                    {backLoaded && <div >
                                                                        <img src="/images/file-icon.png" width="26px" alt="" style={{ marginRight: '20px' }} />
                                                                        <div className="d-flex flex-column" style={{ width: '80%' }}>
                                                                            <div >{backLoaded.name}</div>
                                                                            <div >{(backLoaded.size / 1024 / 1024).toFixed(2)} MB</div>
                                                                        </div>
                                                                        <div className="image-block">
                                                                            <img src="/images/global-cross.png" width="10px" alt="" onClick={() => setbackLoaded(null)} />
                                                                        </div>
                                                                    </div>}
                                                                </div>

                                                            </div>
                                                            <div style={{ paddingBottom: "5%" }} />
                                                            <div className="refer-footer p-0">
                                                                <button type="submit" className="w-100 btn-success bg-success" style={{
                                                                    border: 'none', borderRadius: '5px',
                                                                    fontSize: '1em',
                                                                    fontWeight: '700',
                                                                    height: '48px',
                                                                    color: '#fff',
                                                                    textTransform: 'uppercase',
                                                                }}>
                                                                    {/* <Link  >Next</Link> */}
                                                                    submit
                                                                </button>

                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 card mt-3 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="text-center">Metrics</div>
                            <div className="card-body walletbody mt-2">
                                <div className="col-12">
                                    <div className="row mt-2 p-1">
                                        {/* <div className="col-6 p-1">
                                            <div className="card profile-category text-white text-center px-0">
                                                <p className="mt-2">Games Played</p>
                                                <div className="card-body profilecard text-center align-items-center justify-content-center">
                                                    <h5 className>0.00</h5>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="col-6 p-1">
                                            <div className="card profile-category text-white text-center px-0">
                                                <p className="mt-2">Wining amount </p>
                                                <div className="card-body profilecard text-center align-items-center justify-content-center">
                                                    <h5 className>{profile?.withdrawAmount?.toFixed(2)}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 p-1">
                                            <div className="card profile-category text-white text-center px-0">
                                                <p className="mt-2">Wallet balance </p>
                                                <div className="card-body profilecard text-center align-items-center justify-content-center">
                                                    <h5 className>{profile?.Wallet_balance?.toFixed(2)}</h5>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-6 p-1">
                                            <div className="card profile-category text-white text-center px-0">
                                                <p className="mt-2">Total Withdrawal</p>
                                                <div className="card-body profilecard text-center align-items-center justify-content-center">
                                                    <h5 className>{profile?.totalWithdrawl?.toFixed(2)}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 p-1">
                                            <div className="card profile-category text-white text-center px-0">
                                                <p className="mt-2">Total Deposit</p>
                                                <div className="card-body profilecard text-center align-items-center justify-content-center">
                                                    <h5 className>{profile?.totalDeposit?.toFixed(2)}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 p-1">
                                            <div className="card profile-category text-white text-center px-0">
                                                <p className="mt-2">Bonus </p>
                                                <div className="card-body profilecard text-center align-items-center justify-content-center">
                                                    <h5 className>{profile?.totalBonus?.toFixed(2)}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 p-1">
                                            <div className="card profile-category text-white text-center px-0">
                                                <p className="mt-2">Penalty</p>
                                                <div className="card-body profilecard text-center align-items-center justify-content-center">
                                                    <h5 className>{profile?.totalPenalty?.toFixed(2)}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6 p-1">
                                            <div className="card profile-category text-white text-center px-0">
                                                <p className="mt-2">Refferal Earning</p>
                                                <div className="card-body profilecard text-center align-items-center justify-content-center">
                                                    <h5 className>{profile?.referral_earning?.toFixed(2)}</h5>
                                                </div>
                                            </div>
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

export default ProfilePage;