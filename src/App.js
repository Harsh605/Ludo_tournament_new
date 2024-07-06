import React, { useEffect } from 'react';
import "./App.css";
import Header from './Components/Header';
import { Routes, Route, BrowserRouter, HashRouter, useNavigate, Navigate } from 'react-router-dom';
import Challenge from './Components/ChallengeManager';
import Dashboard from './Components/Dashboard';
import { Login } from '@mui/icons-material';
import AdminLoginPage from './Components/Authentication/LoginPage';

import Layout from './Layout/Layout'
import AuthLayout from './Layout/AuthLayout'
import AdminRegistrationPage from './Components/Authentication/CreateAdmin';
import UserManager from './Components/UserManager';
import EditPermission from './Components/Permissions/EditPermission';
import AdminProfile from './Components/AdminProfile';
import Addcoins from './Components/DepositPayment';
import Withdrawcoins from './Components/Withdrawcoins';
import GameJudgement from './Components/ConflictChallenge';
import Settings from './Components/Setting';
import AdminManager from './Components/AdminManager';
import AdminEarning from './Components/AdminEarning';
import ForgetEmail from './Components/ForgetPassword/ForgetEmail';
import GetForgetOtp from './Components/ForgetPassword/GetForgetOtp';
import ChangePassword from './Components/ForgetPassword/ChangePassword';
import KYCDetail from './Components/KYCDetail';
import PenaltyBonus from './Components/PenaltyBonus';
import NewChallenge from './Components/NewChallenge';
import RunningChallenge from './Components/RunningChallenge';
import CompleteChallenge from './Components/CompleteChallenge';
import CancelledChallenge from './Components/CancelledChallenge';
import DropChallenge from './Components/DropChallenge';
import UserView from './Components/UserView';
import GameView from './Components/GameView';
import IncomeManager from './Components/AllIncome';
import TransactionManager from './Components/AllTransaction';
import WithdrawManager from './Components/Withdraw';
import DepositManager from './Components/Deposit';
import WalletLedger from './Components/WalletLedger';
import UpdatePassword from './Components/UpdatePassword';
import { baseURL } from './token';
import { useState } from 'react';
import axios from 'axios';
import { handleUnAuthorized } from './Components/hooks/handleUnAuthorized';
import Swal from 'sweetalert2';
import UpiGatewayDepositHistory from './Components/UpiGatewayDeposit';
import UpdatePasswordForOthers from './Components/ChangePassForOthers';

function PrivateRoute({ element }) {
    // const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    // Check for the presence of the access token
    const hasAccessToken = localStorage.getItem('access_token');

    useEffect(() => {
        // Redirect to login if not logged in and no access token
        if (!hasAccessToken) {
            navigate('/');
        }
    }, []);
    return hasAccessToken ? element : <Navigate to="/" />;
}
// function LoginPAgeRoute({ element }) {
//     // const { isLoggedIn } = useAuth();
//     const navigate = useNavigate();
//     // Check for the presence of the access token
//     const hasAccessToken = localStorage.getItem('access_token');

//     useEffect(() => {
//         // Redirect to login if not logged in and no access token
//         if (hasAccessToken) {
//             navigate('dashboard');
//         }
//     }, []);
//     return hasAccessToken ? <Navigate to="dashboard" /> : element;
// }

function isAuthenticated() {
    const storedAccessToken = localStorage.getItem('access_token');
    const expirationDate = new Date(localStorage.getItem('access_token_expiration'));
    const date = new Date();

    console.log(date);
    console.log(expirationDate > date);
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




function App() {
    const [paymentGateway,setPaymentGateway] = useState(0)
    useEffect(() => {
        const data = axios.get(baseURL + "settings/data", {}).then((res) => {
          console.log(res.data.paymentGateway);
          setPaymentGateway(res?.data?.paymentGateway);
          
        });
      }, []);
   
    return (
        <>
            <HashRouter>
                {/* <AdminLoginPage /> */}
                {/* <Header /> */}
                <Routes>
                    <Route exact path={`/*`} element={<AuthLayout />}>
                        <Route exact path='' element={isAuthenticated() ? <Navigate to="/dashboard" /> : <AdminLoginPage />}></Route>

                        <Route exact path='forgetPassword' element={<ForgetEmail />}></Route>
                        <Route exact path='getForgetOtp' element={<GetForgetOtp />}></Route>
                        <Route exact path='changePassword' element={<ChangePassword />}></Route>
                        <Route exact path='user/changePassword/:id' element={<UpdatePasswordForOthers />}></Route>
                    </Route>
                    <Route exact path="/*" element={<Layout />}>
                        <Route exact path='dashboard' element={<PrivateRoute element={<Dashboard />} />}></Route>
                        <Route exact path='register' element={<PrivateRoute element={<AdminRegistrationPage />} />}></Route>
                        <Route exact path='agent/permissions' element={<PrivateRoute element={<EditPermission />} />}></Route>
                        <Route exact path='kyc-detail' element={<PrivateRoute element={<KYCDetail />} />}></Route>
                        <Route exact path='penalty-bonus' element={<PrivateRoute element={<PenaltyBonus />} />}></Route>
                        <Route exact path='all-challenge' element={<PrivateRoute element={<NewChallenge />} />}></Route>
                        <Route exact path='running-challenge' element={<PrivateRoute element={<RunningChallenge />} />}></Route>
                        <Route exact path='completed-challenge' element={<PrivateRoute element={<CompleteChallenge />} />}></Route>
                        <Route exact path='cancelled-challenge' element={<PrivateRoute element={<CancelledChallenge />} />}></Route>
                        <Route exact path='conflict-challenge' element={<PrivateRoute element={<GameJudgement />} />}></Route>
                        <Route exact path='drop-challenge' element={<PrivateRoute element={<DropChallenge />} />}></Route>
                        <Route exact path='Challenge' element={<PrivateRoute element={<Challenge />} />}></Route>
                        <Route exact path='UserManager' element={<PrivateRoute element={<UserManager />} />}></Route>
                        <Route exact path='all-income' element={<PrivateRoute element={<IncomeManager />} />}></Route>
                        <Route exact path='all-transaction' element={<PrivateRoute element={<TransactionManager />} />}></Route>
                        <Route exact path='wallet-ledger' element={<PrivateRoute element={<WalletLedger />} />}></Route>
                        <Route exact path='deposit' element={<PrivateRoute element={paymentGateway == 1 ? <UpiGatewayDepositHistory /> : <DepositManager />} />} />
                        <Route exact path='withdraw' element={<PrivateRoute element={<WithdrawManager />} />}></Route>
                        <Route exact path='view' element={<PrivateRoute element={<UserView />} />}></Route>
                        <Route exact path='game-view' element={<PrivateRoute element={<GameView />} />}></Route>
                        <Route exact path='AdminManager' element={<PrivateRoute element={<AdminManager />} />}></Route>
                        <Route exact path='update-password' element={<PrivateRoute element={<UpdatePassword />} />}></Route>
                        {/* <Route exact path='/NewTransaction' element={<NewTransaction />}></Route> */}
                        <Route exact path='EditPermissionr' element={<PrivateRoute element={<EditPermission />} />}></Route>
                        <Route exact path='AdminEarning' element={<PrivateRoute element={<AdminEarning />} />}></Route>
                        <Route exact path='AdminProfile' element={<PrivateRoute element={<AdminProfile />} />}></Route>
                        <Route exact path='Addcoins' element={<PrivateRoute element={<Addcoins />} />}></Route>
                        <Route exact path='Withdrawcoins' element={<PrivateRoute element={<Withdrawcoins />} />}></Route>
                        <Route exact path='GameJudgement' element={<PrivateRoute element={<GameJudgement />} />}></Route>
                        <Route exact path='Setting' element={<PrivateRoute element={<Settings />} />}></Route>
                    </Route>
                </Routes>
            </HashRouter>

        </>
    )
}

export default App;