import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { baseURL } from './RegisterPage';
// import { AuthContext } from '../../App';
import { baseURL } from '../../token';


function SignUpPage() {
    const [username, setUserName] = useState();
    const [referCode, setreferCode] = useState();
    const [password, setPassword] = useState();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    // access token : = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQyLCJyb2xlIjoiYmFzaWMiLCJpYXQiOjE2OTI1MzI3NjksImV4cCI6MTY5NTEyNDc2OX0.nZk-UknVgBpPpgWvqfIIBsIma_fRNCYoXsApIPbdbsk"
    const location = useLocation();
    const { state } = location;

    // Access the data from state or query parameters
    const name = state ? state.name : '';
    const phoneNumber = state ? state.phoneNumber : '';
    const email = state ? state.email : '';
    // const queryParams = new URLSearchParams(location.search);
    // const accessToken = localStorage.getItem('access_token');

    // const name = queryParams.get('name') || '';
    // const phoneNumber = queryParams.get('phoneNumber') || '';
    // const email = queryParams.get('email') || '';

    // const { user, setUser } = useContext(AuthContext)

    const handleSignUpClick = async () => {
        setMessage('');
        console.log(localStorage.getItem('access_token'));
        const accessToken = localStorage.getItem('access_token');
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

        // POST main body  bhi bhj ni pd ti h to vo ase h  :
        const body = {
            name: name,
            username: username,
            password: password,
        }
        try {
            const response = await axios.post(baseURL + '/user/', body, {
                headers: headers
            }
            )
            // setUser({
            //     name: name,
            //     memberType: response.data.data.user.role,
            //     userID: response.data.data.user.id
            // })
            console.log(response)

            if (response.status === 201) {
                navigate('/PlayPage')
            }
        } catch (err) {
            console.error(err);
            setMessage(err?.response?.data?.message);
        }
    }
    return (
        <section id="main-bg">
            <div id="register-container" className="container mx-0">
                <div className="row " id="register">
                    <div className="card h-100 p-0">
                        <h4 className="text-center py-2">Register</h4>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 my-2">
                                    <input type="text" placeholder="Enter Your Name" disabled defaultValue={name} />
                                </div>
                                <p style={{ color: 'red' }}></p>
                                <div className="col-12 my-2">
                                    <input type="text" placeholder="Phone number" disabled defaultValue={phoneNumber} />
                                </div>
                                <p style={{ color: 'red' }} />
                                <div className="col-12 my-2">
                                    <input type="text" placeholder="E-mail" disabled defaultValue={email} />
                                </div>
                                <div className="col-12 my-2">
                                    <input type="text" placeholder="User Name" defaultValue={username} onChange={(e) => setUserName(e.target.value)} />
                                </div>
                                <div className="col-12 my-2">
                                    <input type="password" placeholder="Password" defaultValue={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="col-12 my-2">
                                    <input type="text" placeholder="Refer code (optional)" defaultValue={referCode} onChange={(e) => setreferCode(e.target.value)} />
                                </div>
                                <p style={{ color: 'red' }}>{message}</p>
                                <div className="col-12 my-2">
                                    <button className="bg-orange btn" onClick={handleSignUpClick} >Sign Up</button>
                                </div>
                                <div className="col-12 my-2">
                                    <p className="lh-lg text-center text-light">By Continuing You agree to out<span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}> Legal Terms</span> and you are 18 years of older.</p>
                                </div>
                                <div className="col-12 my-2">
                                    <p className="lh-lg text-center text-light">Already have an account?  <span style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { navigate('/LoginPage') }}> Login</span>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignUpPage