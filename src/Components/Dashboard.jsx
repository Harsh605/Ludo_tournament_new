import React, { useEffect, useState } from 'react';
import AppBlockingRoundedIcon from '@mui/icons-material/AppBlockingRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PublicIcon from '@mui/icons-material/Public';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SavingsIcon from '@mui/icons-material/Savings';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import "./styles/Dashboard.css";
import { Box } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import CountUp from 'react-countup';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import { baseURL } from '../token';
import axios from 'axios';
import { handleUnAuthorized } from './hooks/handleUnAuthorized';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const [todayUserAvarage, setTodayUserAvarage] = useState(75);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState({});
    const [totalAdmin, setTotalAdmin] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalUserBlock, setTotalUserBlock] = useState(0);
    const [totalUserActive, setTotalUserActive] = useState(0);
    const [allChanllenge, setAllChanllenge] = useState(0);
    const [completeChallenge, setCompleteChallenge] = useState(0);
    const [createdChallenge, setCreatedChallenge] = useState(0);
    const [ongoingChallenge, setOngoingChallenge] = useState(0);
    const [cancelledChallenge, setCancelledChallenge] = useState(0);
    const [judgementChallenge, setJudgementChallenge] = useState(0);
    const [totalDeposit, setTotalDeposit] = useState({});
    const [pendingRequest, setPendingRequest] = useState(0);
    const [rejectedRequest, setRejectedRequest] = useState(0);
    const [totalWithdraw, setTotalWithdraw] = useState({});
    const [totalPendingWithdraw, setTotalPendingWithdraw] = useState(0);
    const [totalRejectedWithdraw, setTotalRejectedWithdraw] = useState(0);
    const [totalAdminEarning, setTotalAdminEarning] = useState(0);
    // const [totalDeposit, setTotalDeposit] = useState({});
    // const [judgementChallenge, setJudgementChallenge] = useState(0);
    const navigate = useNavigate()

    function formatDate(inputDate) {
        const parts = inputDate.split('-'); // Split the input date by hyphens
        if (parts.length !== 3) {
            // Ensure the input date is in the expected format
            return 'Invalid Date';
        }

        const year = parts[0].substring(2); // Get the last two digits of the year
        const month = parts[1]; // Month remains the same
        const day = parts[2]; // Day remains the same

        return day + ' ' + month + ' ' + year;
    }

    const start_date = formatDate(startDate);
    const end_date = formatDate(endDate);

    // const handleStartDateChange = (e) => {
    //     setStartDateFilter(e.target.value);
    // };

    // const handleEndDateChange = (e) => {
    //     setEndDateFilter(e.target.value);
    // };

    const pad = (number) => {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    };
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    var day = currentDate.getDate();
    var formattedDate = pad(day) + "-" + pad(month) + "-" + year;


    const TotalAdmin = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/admin`, { headers })
            .then((res) => {
                setTotalAdmin(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TotalUser = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/user`, { headers })
            .then((res) => {
                setTotalUsers(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TotalUserBlock = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/block`, { headers })
            .then((res) => {
                setTotalUserBlock(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TotalUserActive = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/active`, { headers })
            .then((res) => {
                setTotalUserActive(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TotalDeposit = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/deposit`, { headers })
            .then((res) => {
                setTotalDeposit(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TodayData = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `all/user/data/get`, { headers })
            .then((res) => {
                setData(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const AllChallenge = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `admin/challange/all`, { headers })
            .then((res) => {
                setAllChanllenge(res.data.totalPages)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const OngoingChallenge = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `challange/running`, { headers })
            .then((res) => {
                setOngoingChallenge(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const JudgementChallenge = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `challange/conflict_challange`, { headers })
            .then((res) => {
                setJudgementChallenge(res.data.totalPages)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const ChallengeCompleted = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `challange/completed`, { headers })
            .then((res) => {
                setCompleteChallenge(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const ChallengeCancelled = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `challange/cancelled`, { headers })
            .then((res) => {
                setCancelledChallenge(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const PendingRequest = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `count/new/deposit`, { headers })
            .then((res) => {
                setPendingRequest(res.data.count)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const RejectedRequest = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `count/rejected/deposit`, { headers })
            .then((res) => {
                setRejectedRequest(res.data.count)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TotalWithdraw = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/withdraw`, { headers })
            .then((res) => {
                setTotalWithdraw(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TotalPendingWithdraw = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `count/new/withdrawl`, { headers })
            .then((res) => {
                setTotalPendingWithdraw(res.data.count)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TotalRejectedWithdraw = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `count/rejected/withdrawl`, { headers })
            .then((res) => {
                setTotalRejectedWithdraw(res.data.count)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const TotalAdminEarning = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `admin/Earning/total`, { headers })
            .then((res) => {
                setTotalAdminEarning(res.data)
            }).catch(err => {
                handleUnAuthorized(err.response.data, navigate)
            })
    }

    const [KycComplete, setKycComplete] = useState()
    const KycCompleteFunction = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/kyc-complete`, { headers })
            .then((res) => {
                setKycComplete(res.data)
            })
    }

    const [KycPending, setKycPending] = useState()
    const KycPendingFunction = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/kyc-pending`, { headers })
            .then((res) => {
                setKycPending(res.data)
            })
    }

    const [totalReferAmount, setTotalReferAmount] = useState(0)
    const totalReferAmountfunc = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `total/refer-amount`, { headers })
            .then((res) => {
                setTotalReferAmount(res.data)
            })
    }

    const [CLASSIC, setCLASSIC] = useState()
    const CLASSICFunction = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `challange/classic`, { headers })
            .then((res) => {
                setCLASSIC(res.data)
            })
    }

    const [POPULAR, setPOPULAR] = useState()
    const POPULARFunction = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `challange/popular`, { headers })
            .then((res) => {
                setPOPULAR(res.data)
            })
    }

    // console.log(data, ">>>>>>>>>>>>>data")

    useEffect(() => {
        TotalAdmin();
        TotalUser();
        TotalUserBlock();
        TotalUserActive();
        ChallengeCompleted();
        ChallengeCancelled();
        TotalDeposit();
        TodayData();
        AllChallenge();
        OngoingChallenge();
        JudgementChallenge();
        PendingRequest();
        RejectedRequest();
        TotalWithdraw();
        TotalPendingWithdraw();
        TotalRejectedWithdraw();
        TotalAdminEarning();
        KycCompleteFunction();
        KycPendingFunction();
        totalReferAmountfunc();
        POPULARFunction();
        CLASSICFunction();
    }, [])

    // const fetchDetails = async () => {
    //     try {
    //         const body = {
    //             startDate: startDate ? start_date : "20-08-2023",
    //             endDate: endDate ? end_date : formattedDate
    //         }

    //         console.log(body);
    //         const accessToken = localStorage.getItem('access_token');
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    //      ;

    //         const response = await axios.post(baseURL + '/admin/dashboard', body, {
    //             headers: headers,
    //         });
    //         console.log(response.data);
    //         setData(response.data.data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // useEffect(() => {
    //     fetchDetails();
    // }, [startDate, endDate])

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: "column" }}>
                <section className='section'>
                    {/* <form role="form" type="submit">
                        <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                            <div className="form-group">
                                <label>Pick a start date:</label>
                                <div className="input-group date" id="datepicker" data-target-input="nearest">
                                    <input type="date" className="form-control t" placeholder="yyyy-mm-dd" name="start_date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                            <div className="form-group">
                                <label>Pick a end date:</label>
                                <div className="input-group date" id="datepicker1" data-target-input="nearest">
                                    <input type="date" className="form-control " placeholder="yyyy-mm-dd" name="end_date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
                                </div>
                            </div>
                        </div>
                        <br />
                    </form> */}
                    <div className="container-heading">
                        <h1>User Overview</h1>
                    </div>

                    <div className="main-small-box">
                        <div className="small-box bg-info" id='box-1'>
                            <p>Total Admin</p>
                            <div className="inner">
                                <h3> <CountUp end={totalAdmin} duration={5} /> </h3>
                            </div>
                            <div>
                                {/* <h2><CountUp end={totalUsersAvarage} duration={5} />% then last week</h2> */}
                            </div>
                            <div className="icon">
                                < PublicIcon sx={{ color: "#6e6efe" }} className="fas fa-shopping-cart" />
                            </div>
                            <div>
                            </div>
                        </div>
                        <div className="small-box bg-info" id='box-1'>
                            <p>All User</p>
                            <div className="inner">
                                <h3> <CountUp end={totalUsers} duration={5} /> </h3>
                            </div>
                            <div>
                                {/* <h2><CountUp end={totalUsersAvarage} duration={5} />% then last week</h2> */}
                            </div>
                            <div className="icon">
                                < PublicIcon sx={{ color: "#6e6efe" }} className="fas fa-shopping-cart" />
                            </div>
                            <div>
                            </div>
                        </div>
                        {/* <div className="small-box bg-info">
                            <p>Today Users</p>
                            <div className="inner">
                                <h3><CountUp end={todayUser} duration={5} /></h3>

                            </div>
                            <h2> <CountUp end={todayUserAvarage} duration={8} />% then last week</h2>
                            <div className="icon">
                                <AccountCircleRoundedIcon sx={{ color: "#5ea552" }} className="fas fa-shopping-cart" />
                            </div>

                        </div> */}
                        <div className="small-box bg-info" id='box-3'>
                            <p>Block Users</p>
                            <div className="inner">
                                <h3><CountUp end={totalUserBlock} duration={5} /></h3>
                            </div>
                            {/* <h2><CountUp end={blockUsersAvarage} duration={5} />% then last week</h2> */}
                            <div className="icon">
                                <AppBlockingRoundedIcon sx={{ color: "#ff4444" }} className="fas fa-shopping-cart" />
                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>Active Users</p>
                            <div className="inner">
                                <h3><CountUp end={totalUserActive} duration={5} /></h3>
                            </div>
                            {/* <h2>{activeUsersAvarage}% then last week</h2> */}
                            <div className="icon">
                                < RecordVoiceOverIcon sx={{
                                    color: "#14eb62", animation: 'blinkingEffect 1s infinite',
                                    '@keyframes blinkingEffect': {
                                        '0%': { opacity: 1 }, // Fully visible
                                        '50%': { opacity: 0 }, // Fully transparent
                                        '100%': { opacity: 1 }, // Fully visible again
                                    },

                                }} className="fas fa-shopping-cart" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1>Challenge Overview</h1>
                    </div>
                    <div className="main-small-box">
                        <div className="small-box bg-info">
                            <p>All Challenge </p>
                            <div className="inner">
                                <h3><CountUp end={allChanllenge} duration={5} /></h3>
                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div className="icon">
                                < HowToRegIcon className="fas fa-shopping-cart" />
                            </div>
                            <div>
                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>Complete Challenge </p>
                            <div className="inner">
                                <h3><CountUp end={completeChallenge} duration={5} /></h3>
                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div className="icon">
                                < HowToRegIcon className="fas fa-shopping-cart" />
                            </div>
                            <div>
                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>Created Challenge</p>
                            <div className="inner">
                                <h3><CountUp end={data.createdChallenges} duration={5} /></h3>
                            </div>
                            <h2><CountUp end={data?.createdChallenges} duration={5} />% then last week</h2>
                            <div className="icon">
                                < RunningWithErrorsIcon className="fas fa-shopping-cart" />
                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p> Ongoing Challenge</p>
                            <div className="inner">
                                <h3><CountUp end={ongoingChallenge} duration={5} /></h3>
                            </div>
                            {/* <h2><CountUp end={blockUsersAvarage} duration={5} />% then last week</h2> */}
                            <div className="icon">
                                <i className="fas fa-shopping-cart" />
                            </div>

                        </div>
                        <div className="small-box bg-info">
                            <p>Cancelled Challenge</p>
                            <div className="inner">
                                <h3><CountUp end={cancelledChallenge} duration={5} /></h3>

                            </div>
                            {/* <h2>{<CountUp end={activeUsersAvarage} duration={5} />}% then last week</h2> */}
                            <div className="icon">
                                < CancelIcon sx={{ color: "#ff4444" }} className="fas fa-shopping-cart" />
                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>Conflict Challenge</p>
                            <div className="inner">
                                <h3><CountUp end={judgementChallenge} duration={5} /></h3>
                            </div>
                            {/* <h2>{<CountUp end={activeUsersAvarage} duration={5} />}% then last week</h2> */}
                            <div className="icon">
                                < CancelIcon sx={{ color: "#ff4444" }} className="fas fa-shopping-cart" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1>Deposit Overview</h1>
                    </div>
                    <div className="main-small-box">
                        <div className="small-box bg-info">
                            <p>Total Deposit</p>
                            <div className="inner">
                                <h3>{<CountUp end={totalDeposit.data} duration={5} />}</h3>

                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div className="icon">
                                < CurrencyRupeeIcon sx={{ color: 'green' }} className="fas fa-shopping-cart" />
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>Today Deposit</p>
                            <div className="inner">
                                <h3>{data.todayTotalDeposit}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <SavingsIcon sx={{ color: 'pink' }} className="fas fa-shopping-cart" />
                            </div>

                        </div>
                        <div className="small-box bg-info">
                            <p>Total Request</p>
                            <div className="inner">
                                <h3>{totalDeposit.count}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <SavingsIcon sx={{ color: 'pink' }} className="fas fa-shopping-cart" />
                            </div>

                        </div>

                        <div className="small-box bg-range">
                            <p>Range Deposits</p>
                            {/* <div className="inner"> */}
                            <h3>{data.rangeDeposits}</h3>
                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                <div className="form-group">
                                    <label>Pick a start date:</label>
                                    <div className="input-group date" id="datepicker" data-target-input="nearest">
                                        <input type="date" className="form-control t" placeholder="yyyy-mm-dd" name="start_date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                <div className="form-group">
                                    <label>Pick a end date:</label>
                                    <div className="input-group date" id="datepicker1" data-target-input="nearest">
                                        <input type="date" className="form-control " placeholder="yyyy-mm-dd" name="end_date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
                                    </div>
                                </div>
                            </div>

                            {/* </div> */}
                            {/* <h2>{blockUsersAvarage}% then last week</h2> */}
                            <div className="icon">
                                <i className="fas fa-shopping-cart" />
                            </div>

                        </div>



                        <div className="small-box bg-info">
                            <p>Pending Request</p>
                            <div className="inner">
                                <h3>{pendingRequest}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <SavingsIcon sx={{ color: 'pink' }} className="fas fa-shopping-cart" />
                            </div>

                        </div>
                        <div className="small-box bg-info">
                            <p>Rejected Request</p>
                            <div className="inner">
                                <h3>{rejectedRequest}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <SavingsIcon sx={{ color: 'pink' }} className="fas fa-shopping-cart" />
                            </div>

                        </div>



                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1> Withdraw Overview</h1>
                    </div>


                    <div className="main-small-box">


                        <div className="small-box bg-info">
                            <p>Total Withdraw</p>
                            <div className="inner">
                                <h3>{totalWithdraw.data}</h3>

                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div className="icon">
                                < PriceCheckIcon sx={{ color: 'lightgreen' }} className="fas fa-shopping-cart" />
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>Today Withdraw</p>
                            <div className="inner">
                                <h3>{data.todayTotalWithdraw}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <CurrencyExchangeIcon className="fas fa-shopping-cart" />
                            </div>

                        </div>
                        <div className="small-box bg-info">
                            <p>Total Request</p>
                            <div className="inner">
                                <h3>{totalWithdraw.count}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <CurrencyExchangeIcon className="fas fa-shopping-cart" />
                            </div>

                        </div>
                        <div className="small-box bg-range">
                            <p>Withdraw Range</p>
                            <h3>{data.rangeWithdraw}</h3>
                            {/* <div className="inner">

                            </div> */}
                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                <div className="form-group">
                                    <label>Pick a start date:</label>
                                    <div className="input-group date" id="datepicker" data-target-input="nearest">
                                        <input type="date" className="form-control t" placeholder="yyyy-mm-dd" name="start_date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                <div className="form-group">
                                    <label>Pick a end date:</label>
                                    <div className="input-group date" id="datepicker1" data-target-input="nearest">
                                        <input type="date" className="form-control " placeholder="yyyy-mm-dd" name="end_date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
                                    </div>
                                </div>
                            </div>
                            {/* <h2>{blockUsersAvarage}% then last week</h2> */}
                            <div className="icon">
                                <i className="fas fa-shopping-cart" />
                            </div>

                        </div>


                        <div className="small-box bg-info">
                            <p>Total Pending Request</p>
                            <div className="inner">
                                <h3>{totalPendingWithdraw}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <CurrencyExchangeIcon className="fas fa-shopping-cart" />
                            </div>

                        </div>

                        <div className="small-box bg-info">
                            <p>Total Rejected Request</p>
                            <div className="inner">
                                <h3>{totalRejectedWithdraw}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <CurrencyExchangeIcon className="fas fa-shopping-cart" />
                            </div>

                        </div>

                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1> Commission Overview</h1>
                    </div>


                    <div className="main-small-box">


                        <div className="small-box bg-info">
                            <p>Total Admin Commission </p>
                            <div className="inner">
                                <h3>{totalAdminEarning.total}</h3>

                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div id='icon-container' className="icon">
                                <InsertChartIcon className="color-changing-icon" />
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>  Today Admin Commission</p>
                            <div className="inner">
                                <h3>{data?.todayCommission}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <DataThresholdingIcon className="color-changings-icons" />
                            </div>

                        </div>
                        <div className="small-box bg-range">
                            <p>In Range</p>
                            {/* <div className="inner"> */}
                            <h3>{data.penaltyCoins}</h3>
                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                <div className="form-group">
                                    <label>Pick a start date:</label>
                                    <div className="input-group date" id="datepicker" data-target-input="nearest">
                                        <input type="date" className="form-control t" placeholder="yyyy-mm-dd" name="start_date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                <div className="form-group">
                                    <label>Pick a end date:</label>
                                    <div className="input-group date" id="datepicker1" data-target-input="nearest">
                                        <input type="date" className="form-control " placeholder="yyyy-mm-dd" name="end_date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
                                    </div>
                                </div>
                            </div>
                            {/* </div> */}
                            {/* <h2>{blockUsersAvarage}% then last week</h2> */}
                            <div className="icon">
                                <i className="fas fa-shopping-cart" />
                            </div>

                        </div>

                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1> Penalty Overview</h1>
                    </div>


                    <div className="main-small-box">


                        <div className="small-box bg-info">
                            <p>Total Penalty </p>
                            <div className="inner">
                                <h3>{0}</h3>

                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div id='icon-container' className="icon">
                                <InsertChartIcon className="color-changing-icon" />
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>  Today Penalty</p>
                            <div className="inner">
                                <h3>{0}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <DataThresholdingIcon className="color-changings-icons" />
                            </div>

                        </div>
                        <div className="small-box bg-range">
                            <p>In Range</p>
                            <div className="inner">
                                <h3>{data.penaltyCoins}</h3>

                            </div>
                            {/* <h2>{blockUsersAvarage}% then last week</h2> */}
                            <div className="icon">
                                <i className="fas fa-shopping-cart" />
                            </div>

                        </div>

                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1> Bonus Overview</h1>
                    </div>


                    <div className="main-small-box">


                        <div className="small-box bg-info">
                            <p>Total Bonus </p>
                            <div className="inner">
                                <h3>{0}</h3>

                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div id='icon-container' className="icon">
                                <InsertChartIcon className="color-changing-icon" />
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>  Today Bonus</p>
                            <div className="inner">
                                <h3>{0}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <DataThresholdingIcon className="color-changings-icons" />
                            </div>

                        </div>
                        <div className="small-box bg-range">
                            <p>In Range</p>
                            {/* <div className="inner"> */}
                            <h3>{data.penaltyCoins}</h3>
                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                <div className="form-group">
                                    <label>Pick a start date:</label>
                                    <div className="input-group date" id="datepicker" data-target-input="nearest">
                                        <input type="date" className="form-control t" placeholder="yyyy-mm-dd" name="start_date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                <div className="form-group">
                                    <label>Pick a end date:</label>
                                    <div className="input-group date" id="datepicker1" data-target-input="nearest">
                                        <input type="date" className="form-control " placeholder="yyyy-mm-dd" name="end_date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
                                    </div>
                                </div>
                            </div>
                            {/* </div> */}
                            {/* <h2>{blockUsersAvarage}% then last week</h2> */}
                            <div className="icon">
                                <i className="fas fa-shopping-cart" />
                            </div>

                        </div>

                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1> Referral Earning</h1>
                    </div>


                    <div className="main-small-box">


                        <div className="small-box bg-info">
                            <p>All User Total Referral Earning </p>
                            <div className="inner">
                                <h3>{totalReferAmount?.count}</h3>

                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div id='icon-container' className="icon">
                                <InsertChartIcon className="color-changing-icon" />
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>  Today Referral Earning</p>
                            <div className="inner">
                                <h3>{data?.totalReferralEarning}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <DataThresholdingIcon className="color-changings-icons" />
                            </div>

                        </div>
                        <div className="small-box bg-info">
                            <p>  Specific Id Total Referral Earning</p>
                            <div className="inner">
                                <h3>{0}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <DataThresholdingIcon className="color-changings-icons" />
                            </div>

                        </div>


                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1> Game Overview</h1>
                    </div>


                    <div className="main-small-box">


                        <div className="small-box bg-info">
                            <p>Classic </p>
                            <div className="inner">
                                <h3>{CLASSIC}</h3>

                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div id='icon-container' className="icon">
                                <InsertChartIcon className="color-changing-icon" />
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>  Popular</p>
                            <div className="inner">
                                <h3>{POPULAR}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <DataThresholdingIcon className="color-changings-icons" />
                            </div>

                        </div>

                    </div>
                </section>
                <section className='section'>
                    <div className="container-heading">
                        <h1> KYC Overview</h1>
                    </div>


                    <div className="main-small-box">


                        <div className="small-box bg-info">
                            <p>Kyc Pending </p>
                            <div className="inner">
                                <h3>{KycPending}</h3>

                            </div>
                            <div>
                                {/* <h2>{totalUsersAvarage}% then last week</h2> */}
                            </div>
                            <div id='icon-container' className="icon">
                                <InsertChartIcon className="color-changing-icon" />
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className="small-box bg-info">
                            <p>  Kyc Complete</p>
                            <div className="inner">
                                <h3>{KycComplete}</h3>

                            </div>
                            {/* <h2>{todayUserAvarage}% then last week</h2> */}
                            <div className="icon">
                                <DataThresholdingIcon className="color-changings-icons" />
                            </div>

                        </div>

                    </div>
                </section>

            </Box>
        </>
    )
}

export default Dashboard;