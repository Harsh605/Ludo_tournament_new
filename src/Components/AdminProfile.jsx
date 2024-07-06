import React, { useEffect, useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    IconButton,
    Input,
    Typography,
} from "@mui/material";
// import EditPassword from "./Component/EditPassword";
import { baseURL } from "../token";
import { useNavigate } from "react-router";
import axios from "axios";
import { handleUnAuthorized } from "./hooks/handleUnAuthorized";

function AdminProfile() {
    const navigate = useNavigate();
    const [open2, setOpen2] = useState(false);
    const [adminData, setAdminData] = useState({});
    const [editMode, setEditMode] = useState(false);

    const fetchDetails = async () => {
        try {
            const adminDetails = localStorage.getItem('adminDetails');
            if (adminDetails) {
                setAdminData(JSON.parse(adminDetails))
            }
        } catch (err) {
            console.log(err);
        }
    };

    const updateDetails = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        const payload = {
            Name: adminData.Name,
            Email: adminData.Email,
            Phone: adminData.Phone
        }
        axios.patch(baseURL + `admin/edit/user/${adminData._id}`, payload, { headers })
            .then((res) => {
                handleEditMode()
                localStorage.setItem('adminDetails', JSON.stringify(res.data))
                setAdminData(res.data)
                // setData(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const handleEditMode = () => {
        setEditMode(!editMode);
    };

    useEffect(() => {
        fetchDetails();
    }, []);

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

    const handleLogout = () => {
        // removeAccessToken()
        //     .then(() => {
        //         navigate('/');
        //     })
        //     .catch(error => {
        //         console.error('An error occurred:', error);
        //     });
        localStorage.removeItem('access_token')
        localStorage.removeItem('adminDetails')
        localStorage.removeItem('access_token_expiration')
        navigate('/')
        setTimeout(() => {
            window.location.reload()
        }, 100)
    }

    return (

        <>
            <div className='fade-in'>
                <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                    <h3 style={{ color: 'white' }}>Admin Profile</h3>
                </div>
                <section style={{ marginTop: '2rem', borderRadius: '5px', backgroundColor: '#a6a6ff' }}>
                    <div style={{ background: '#a6a6ff' }} className="container  py-5">
                        <div className="row">
                            <div className="col">

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4">
                                <div style={{ alignItems: 'center' }} className="card mb-4">
                                    <div className="card-body text-center">

                                        <Avatar alt="avatar" className="rounded-cicle img-fluid" sx={{ width: "150px", height: '150px ' }} />
                                        <h5 class="my-3">{adminData?.Name}</h5>
                                        <p class="text-muted mb-1">{adminData?.Email}</p>
                                        {/* <p class="text-muted mb-4">Bay Area, San Francisco, CA</p> */}
                                        <div className="d-flex justify-content-center mb-2">
                                            {editMode ? (
                                                <>
                                                    <button

                                                        type="button"
                                                        className="btn btn-outline-primary ms-1"
                                                        onClick={handleEditMode}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        style={{ marginLeft: '1rem' }}

                                                        type="button"
                                                        className="btn btn-outline-primary ms-1"

                                                        onClick={(e) => { updateDetails() }}
                                                    >
                                                        Save
                                                    </button>
                                                </>
                                            ) : (
                                                <>

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary ms-1"
                                                        onClick={handleEditMode}>
                                                        Edit Profile <BorderColorIcon />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary ms-1"
                                                onClick={() => navigate('/update-password')}>
                                                Update Password
                                                {/* <BorderColorIcon /> */}
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary ms-1 mt-2"
                                            onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                                {/* <div className="card mb-4 mb-lg-0">
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush rounded-3">
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fas fa-globe fa-lg text-warning" />
                                            <p className="mb-0">https://mdbootstrap.com</p>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fab fa-github fa-lg" style={{ color: '#333333' }} />
                                            <p className="mb-0">mdbootstrap</p>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fab fa-twitter fa-lg" style={{ color: '#55acee' }} />
                                            <p className="mb-0">@mdbootstrap</p>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fab fa-instagram fa-lg" style={{ color: '#ac2bac' }} />
                                            <p className="mb-0">mdbootstrap</p>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fab fa-facebook-f fa-lg" style={{ color: '#3b5998' }} />
                                            <p className="mb-0">mdbootstrap</p>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}
                            </div>
                            <div className="col-lg-8">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <div style={{}} className="row">
                                            <div className="col-sm-3">

                                                <p className="mb-0">Full Name</p>
                                            </div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={adminData.Name}
                                                        name="name"
                                                        onChange={(e) =>
                                                            setAdminData({
                                                                ...adminData,
                                                                Name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    <p className="text-muted mb-0">{adminData.Name}</p>
                                                )}

                                            </div>
                                        </div>

                                        {/* <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <p className="mb-0"> Admin Username</p>
                                            </div>
                                            <div className="col-sm-9">

                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={adminData.username}
                                                        name="name"
                                                        onChange={(e) =>
                                                            setAdminData({
                                                                ...adminData,
                                                                username: e.target.value,
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    <p className="text-muted mb-0">{adminData.username}</p>
                                                )}

                                            </div>
                                        </div> */}
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <p className="mb-0">Email</p>
                                            </div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={adminData.Email}
                                                        name="name"
                                                        onChange={(e) =>
                                                            setAdminData({
                                                                ...adminData,
                                                                Email: e.target.value,
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    <p className="text-muted mb-0">{adminData.Email}</p>
                                                )}

                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <p className="mb-0">Phone</p>
                                            </div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input
                                                        type="text"
                                                        value={adminData.Phone}
                                                        className="form-control"
                                                        name="name"

                                                        onChange={(e) => {
                                                            if (e.target.value.length === 11) return
                                                            setAdminData({
                                                                ...adminData,
                                                                Phone: e.target.value,
                                                            })
                                                        }
                                                        }
                                                    />
                                                ) : (
                                                    <p className="text-muted mb-0">{adminData.Phone}</p>
                                                )}

                                            </div>
                                        </div>
                                        <hr />


                                    </div>
                                </div>
                                {/* <div className="row">
                                <div className="col-md-6">
                                    <div className="card mb-4 mb-md-0">
                                        <div className="card-body">
                                            <p className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status
                                            </p>
                                            <p className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</p>
                                            <div className="progress rounded" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '80%' }} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                            <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</p>
                                            <div className="progress rounded" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '72%' }} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                            <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</p>
                                            <div className="progress rounded" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '89%' }} aria-valuenow={89} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                            <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</p>
                                            <div className="progress rounded" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '55%' }} aria-valuenow={55} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                            <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</p>
                                            <div className="progress rounded mb-2" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '66%' }} aria-valuenow={66} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card mb-4 mb-md-0">
                                        <div className="card-body">
                                            <p className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status
                                            </p>
                                            <p className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</p>
                                            <div className="progress rounded" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '80%' }} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                            <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</p>
                                            <div className="progress rounded" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '72%' }} aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                            <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</p>
                                            <div className="progress rounded" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '89%' }} aria-valuenow={89} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                            <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</p>
                                            <div className="progress rounded" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '55%' }} aria-valuenow={55} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                            <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</p>
                                            <div className="progress rounded mb-2" style={{ height: 5 }}>
                                                <div className="progress-bar" role="progressbar" style={{ width: '66%' }} aria-valuenow={66} aria-valuemin={0} aria-valuemax={100} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            </div>
                        </div>
                    </div>
                </section>

            </div>


        </>

    )
}

export default AdminProfile;
