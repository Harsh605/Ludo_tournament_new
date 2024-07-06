import React, { createContext, useState, useEffect } from 'react'
import {BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import UserPage from './Components/UserView/UserPage';
import WalletPage from './Components/Transaction/WalletPage';
import HistoryPage from './Components/HistoryPage';
import ProfilePage from './Components/ProfilePage';
// import ReferandEarn from './Components/ReferandEarn';
// import SpinadnWin from './Components/SpinadnWin';
import LanguagesPage from './Components/LanguagesPage';
import SupportPage from './Components/SupportPage';
import LegalPage from './Components/LegalPage';
import AddChipsPage from './Components/Transaction/AddChipsPage';
import WithDrawPage from './Components/Transaction/WithDrawPage';
import PalyPage from './GameTypes/PlayPage';
import FirstGame from './GameTypes/FirstGame';
import MainPage from './Components/MainPage';
import RegisterPage from './Components/Authentication/RegisterPage';
import LoginPage from './Components/Authentication/LoginPage';
import SecondPage from './GameTypes/SecondPage';
import EnterFirstGame from './GameTypes/EnterFirstGame';
import OTPPage from './Components/Authentication/OTPPage';
import SignUpPage from './Components/Authentication/SignUpPage';
import RegisterLegalPage from './Components/RegisterLegalPAge';
import ForgetEmail from './Components/ForgetPassword/ForgetEmail';
import GetForgetOtp from './Components/ForgetPassword/GetForgetOtp';
import ChangePassword from './Components/ForgetPassword/ChangePassword';
import Share from './Components/Share';
import SharePage from './Components/Share';
import axios from 'axios';
import { baseURL } from './token';
import './App.css'
import UpiPaymentGateway from './Components/Transaction/AutomaticUpiGateway';
import UpiGatewayHistoryPage from './Components/UpiGatewayHistoryPage';

function PrivateRoute({ element }) {
    // const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    // Check for the presence of the access token
    const hasAccessToken = localStorage.getItem('access_token');
    // console.log(hasAccessToken, "hassacces");
    // useEffect(() => {
    // Redirect to login if not logged in and no access token

    //     if (!hasAccessToken) {
    //         navigate('/LoginPage');
    //     }
    // }, []);
    return hasAccessToken ? element : <Navigate to="/LoginPage" />;
}
function isAuthenticated() {
    const storedAccessToken = localStorage.getItem('access_token');
    const expirationDate = new Date(localStorage.getItem('access_token_expiration'));
    const date = new Date();

    // console.log(date);
    // console.log(expirationDate > date);
    if (storedAccessToken && expirationDate > date) {
        // The access token is valid
        // Use `storedAccessToken` for your API requests
        return true;
    } else {
        // The access token has expired or doesn't exist
        // You may need to handle token refresh or reauthentication here
        return false;
    }
}


export const AuthContext = createContext()
function App() {
    const [user, setUser] = useState({
        name: '',
        memberType: '',
        userID: ''
    })
    const [user1, setUser1] = useState();

    const getUser = async () => {
        const access_token = localStorage.getItem("access_token");

        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        await axios
            .get(baseURL + `/me`, { headers })
            .then((res) => {
                setUser1(res.data);
            })
            .catch((e) => {
                if (e.response.status === 401) {
                    localStorage.removeItem("access_token");
                }
            });
    };
    return (
        <>
            <AuthContext.Provider value={{ user, setUser }}>
                <BrowserRouter>
                    <Routes>
                        <Route exact path='/' element={<PrivateRoute element={<MainPage />} />}></Route>
                        {/* <Route exact path='/' element={<PrivateRoute element={isAuthenticated() ? <Navigate to="/UserPage" /> : <MainPage />} />}></Route> */}
                        <Route exact path='/RegisterPage' element={isAuthenticated() ? <Navigate to="/UserPage" /> : <RegisterPage />}></Route>
                        <Route exact path="/RegisterLegalPage" element={isAuthenticated() ? <Navigate to="/UserPage" /> : <RegisterLegalPage />}></Route>
                        <Route exact path='/LoginPage' element={isAuthenticated() ? <Navigate to="/UserPage" /> : <LoginPage />}></Route>

                        {/* <Route exact path='/forgetPassword' element={<ForgetEmail />}></Route> */}
                        <Route exact path='/getForgetOtp' element={<GetForgetOtp />}></Route>
                        <Route exact path='/changePassword' element={<ChangePassword />}></Route>

                        <Route exact path='/OTPPage' element={<OTPPage />} />
                        <Route exact path='/SignUpPage' element={<SignUpPage />} ></Route>
                        <Route exact path='/UserPage' element={<PrivateRoute element={<UserPage />} />} ></Route>
                        <Route exact path='/PlayPage' element={<PrivateRoute element={<PalyPage />} />} ></Route>
                        <Route exact path='/FirstGame' element={<PrivateRoute element={<FirstGame />} />} ></Route>
                        <Route exact path='/share' element={<PrivateRoute element={<SharePage />} />} />
                        <Route exact path='/viewgame/:id' element={<PrivateRoute element={<EnterFirstGame />} />} ></Route>
                        <Route exact path='/SecondPage/:id' element={<PrivateRoute walletUpdate={getUser} element={<SecondPage />} />} ></Route>
                        <Route exact path='/WalletPage' element={<PrivateRoute element={<WalletPage />} />} ></Route>
                        <Route exact path='/HistoryPage/:id' element={<PrivateRoute element={<HistoryPage />} />} ></Route>
                        <Route exact path='/UpiGatewayHistoryPage' element={<PrivateRoute element={<UpiGatewayHistoryPage />} />} ></Route>
                        <Route exact path='/ProfilePage' element={<PrivateRoute element={<ProfilePage />} />} ></Route>
                        {/* <Route exact path='/ReferandEarn' element={<ReferandEarn />}></Route>
                        <Route exact path='/SpinandWin' element={<SpinadnWin />}></Route> */}
                        <Route exact path='/LanguagesPage' element={<PrivateRoute element={<LanguagesPage />} />} ></Route>
                        <Route exact path='/SupportPage' element={<PrivateRoute element={<SupportPage />} />} ></Route>
                        <Route exact path='/LegalPage' element={<PrivateRoute element={<LegalPage />} />} ></Route>
                        <Route exact path='/AddChipsPage' element={<PrivateRoute element={<AddChipsPage />} />} ></Route >
                        <Route exact path='/UpiPaymentGateway' element={<PrivateRoute element={<UpiPaymentGateway />} />} ></Route >
                        <Route exact path='/WithDrawPage' element={<PrivateRoute element={<WithDrawPage />} />
                        } ></Route >
                    </Routes >
                </BrowserRouter >
            </AuthContext.Provider >
        </>
        
    )
}

export default App;