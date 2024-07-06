import React, { useState } from 'react';
import HeaderComponent from '../HeaderComponent';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { baseURL } from '../../token';
import axios from 'axios';
import { useEffect } from 'react';
import { handleUnAuthorized } from '../hooks/handleUnAuthorized';
import Swal from 'sweetalert2';
function WithDrawPage() {
    const navigate = useNavigate();

    const access_token = localStorage.getItem("access_token");
    const [Id, setId] = useState(null);
    const [user, setUser] = useState();
    const [holder_name, setHolder_name] = useState();
    const [account_number, setAccount_number] = useState();
    const [ifsc_code, setIfsc_code] = useState();
    const [upi_id, setUpi_id] = useState();
   const [confirmUpiId, setConfirmUpiId] = useState('');
    const [chipAmount, setChipAmount] = useState('');    
    const [next, setNext] = useState(false);

    const [isCashFreePayoutActive, setCashFreePayoutActive] = useState(false);
    const [isRazorPayPayoutActive, setRazorPayPayoutActive] = useState(false);
    const [isDecentroPayoutActive, setDecentroPayoutActive] = useState(false);
    const [isManualPayoutActive, setManualPayoutActive] = useState(false);

    const [isRazorPayPayoutAuto, setRazorPayPayoutAuto] = useState(false);
    const [isDecentroPayoutAuto, setDecentroPayoutAuto] = useState(false);
    const [maxAutopayAmt, setMaxAutopayAmt] = useState(0);

    const [submitBtn, setSubmitBtn] = useState(true);

    const getUser = () => {
        let access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        axios
            .get(baseURL + `/me`, { headers })
            .then((res) => {
                setUser(res.data);
                setId(res.data._id);
                setHolder_name(res.data.holder_name);
                setAccount_number(res.data.account_number);
                setIfsc_code(res.data.ifsc_code);
                setUpi_id(res.data.upi_id);
            })
            .catch((e) => {
                if (e?.response?.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
            });
    }

    useEffect(() => {
        let access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        getUser()
        axios
            .get(baseURL + `/website/setting`)
            .then((res) => {
                //console.log(res);
                setCashFreePayoutActive(res.data.isCashFreePayoutActive);
                setRazorPayPayoutActive(res.data.isRazorPayPayoutActive);
                setDecentroPayoutActive(res.data.isDecentroPayoutActive);
                setManualPayoutActive(res.data.isManualPayoutActive);

                setRazorPayPayoutAuto(res.data.isRazorPayPayoutAuto);
                setDecentroPayoutAuto(res.data.isDecentroPayoutAuto);
                setMaxAutopayAmt(res.data.maxAutopayAmt);
            })
            .catch((e) => {
                setManualPayoutActive(false);
                setCashFreePayoutActive(false);
                setRazorPayPayoutActive(false);
                setDecentroPayoutActive(false);
                setMaxAutopayAmt(0);
            });
    }, []);

    const updateBankDetails = async () => {
        setMount(true);
        setSubmitBtn(false);
        // e.preventDefault();
        console.log('type :>> ', type);
        let confirm = false;
        if (type == "upi" || type == "manualupi") {
            let regex = /^[\w.-]+@[\w.-]+$/.test(upi_id);

            if (regex == true) {
                Swal.fire({
                    title: `Is your UPI ID  is correct ? ` + upi_id,
                    icon: "success",
                    confirmButtonText: "OK",
                });
                confirm = true;
            } else {
                Swal.fire({
                    title: "Invalid UPI ID: " + upi_id,
                    icon: "error",
                    confirmButtonText: "OK",
                });
                confirm = false;
                setSubmitBtn(true);
            }
        } else {
            if (!holder_name || !account_number || !ifsc_code) {
                setMount(false);
                setSubmitBtn(true);
                Swal.fire({
                    title: "Invalid Bank Details",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                confirm = false;
            } else {
                confirm = true;
            }
            //var confirmMsg = `Is your Bank Account Number is correct ? `+account_number;
        }

        if (confirm) {
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };
            const data = await axios
                .patch(
                    baseURL + `/user/edit`,
                    {
                        holder_name,
                        account_number,
                        ifsc_code,
                        upi_id,
                        bankDetails: true,
                    },
                    { headers }
                )
                .then((res) => {

                    if (res.data.subCode === "200") {
                        let calculatedWallet =
                            user.wonAmount -
                            user.loseAmount +
                            user.totalDeposit +
                            user.referral_earning +
                            user.hold_balance +
                            user.totalBonus -
                            (user.totalWithdrawl + user.referral_wallet + user.totalPenalty);
                        calculatedWallet == user.Wallet_balance
                            ? doAutoPayout()
                            : withReqComes();
                    } else {
                        setMount(false);
                        setSubmitBtn(true);
                        Swal.fire({
                            title: res.data.message,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                })
                .catch((e) => {
                    console.log(e);
                    if (e.response.status == 401) {
                        handleUnAuthorized(e.response.status, navigate)
                    }
                });
        } else {
            setMount(false);
            setSubmitBtn(true);
        }
    };

    const [amount, setAmount] = useState();
    const [type, setType] = useState('manualupi');
    const [mount, setMount] = useState(false);
    console.log('amount :>> ', amount);
    // const [accunt, setUpi] = useState()
    // const [account_no, setAccount_no] = useState()
    // const [IFSC, setIFSC] = useState();

    //this function for handleAuto payout service with payment gateway

    const doAutoPayout = () => {
        if (isRazorPayPayoutAuto && type == "upi") {
            //alert('payoutFromRazorpay');
            if (amount <= maxAutopayAmt) {
                // payoutFromRazorpay();
                withReqComes();
            } else {
                // payoutFromRazorpay();
                withReqComes();
            }
        } else if (isDecentroPayoutAuto && type == "banktransfer") {
            //alert('payoutFromDecentro');
            if (amount <= maxAutopayAmt) {
                payoutFromDecentro();
            } else {
                withReqComes();
            }
        } else if (isManualPayoutActive && type == "manualupi") {
            //alert('payoutFromDecentro');
            if (amount <= maxAutopayAmt) {
                payoutFromManual();
            } else {
                withReqComes();
            }
        } else {
            //alert('withReqComes');
            withReqComes();
        }
    };

    //use for Razorpay payout

    const payoutFromManual = () => {
        if (amount && amount >= 95 && amount <= 10000 && type) {
            // e.preventDefault();
            const payment_gatway = "manualupi";
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };

            axios
                .post(
                    baseURL + `/withdraw/payoutmanualupi`,
                    {
                        amount,
                        type,
                        payment_gatway,
                    },
                    { headers }
                )
                .then((response) => {
                    getUser();
                    setMount(false);

                    if (response.data.status === "Processing") {
                        setTimeout(() => {
                            axios
                                .get(baseURL + `/manual/payoutstatus/${response.data._id}`, {
                                    headers,
                                })
                                .then((res) => {
                                    //console.log(res);
                                    const icon =
                                        res.data.status === "SUCCESS" ? "success" : "danger";
                                    var title = "";
                                    if (res.data && res.data.status === "SUCCESS") {
                                        title = "Withdraw successfully done";
                                    } else if (res.data && res.data.status === "Processing") {
                                        title = "Withdrawal transaction in proccess.";
                                    } else if (!res.data.status) {
                                        title = "Withdraw request transaction Rejected";
                                    }

                                    navigate('/UserPage')
                                    setTimeout(() => {
                                        setMount(false);
                                        Swal.fire({
                                            title: title,
                                            icon: icon,
                                            confirmButtonText: "OK",
                                        });
                                    }, 1000);
                                });
                        }, 30000);
                        setMount(true);
                    } else {
                        Swal.fire({
                            title: response.data.message,
                            icon: "danger",
                            confirmButtonText: "OK",
                        });
                    }
                })
                .catch((e) => {
                    setMount(false);
                    Swal.fire({
                        title: "Error! try after sometime.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    console.log(e);
                });
        } else {
            setMount(false);
            let msg = "Enter all fields";
            if (!amount || !type) {
                let msg = "Enter all fields";
            } else if (95 <= amount <= 50000) {
                msg = "amount should be more than 95 and less then 10000.";
            }
            Swal.fire({
                title: msg,
                icon: "Error",
                confirmButtonText: "OK",
            });
        }
    };

    const payoutFromRazorpay = () => {
        if (amount && amount >= 95 && amount <= 50000 && type) {
            // e.preventDefault();
            const payment_gatway = "razorpay";
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };

            axios
                .post(
                    baseURL + `/withdraw/payoutrazorpaybank`,
                    {
                        amount,
                        type,
                        payment_gatway,
                    },
                    { headers }
                )
                .then((res) => {
                    getUser();
                    setMount(false);

                    if (res.data.subCode === "200") {

                        Swal.fire({
                            title: res.data.message,
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        Swal.fire({
                            title: res.data.message,
                            icon: "danger",
                            confirmButtonText: "OK",
                        });
                    }
                })
                .catch((e) => {
                    setMount(false);
                    Swal.fire({
                        title: "Error! try after sometime.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    console.log(e);
                });
        } else {
            setMount(false);
            let msg = "Enter all fields";
            if (!amount || !type) {
                let msg = "Enter all fields";
            } else if (95 <= amount <= 50000) {
                msg = "amount should be more than 95 and less then 50000.";
            }
            Swal.fire({
                title: msg,
                icon: "Error",
                confirmButtonText: "OK",
            });
        }
    };

    //use for Razorpay payout end

    //use for decentro payout

    const payoutFromDecentro = () => {
        if (amount && amount >= 95 && amount <= 50000 && type) {
            // e.preventDefault();
            const payment_gatway = "decentro";
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };

            axios
                .post(
                    baseURL + `/withdraw/payoutdecentrobank`,
                    {
                        amount,
                        type,
                        payment_gatway,
                    },
                    { headers }
                )
                .then((res) => {
                    setTimeout(() => {
                        getUser();
                    }, 5000);
                    setMount(false);

                    if (res.data.subCode === "200") {

                        Swal.fire({
                            title: res.data.message,
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        Swal.fire({
                            title: res.data.message,
                            icon: "danger",
                            confirmButtonText: "OK",
                        });
                    }
                })
                .catch((e) => {
                    setMount(false);
                    Swal.fire({
                        title: "Error! try after sometime.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    console.log(e);
                });
        } else {
            setMount(false);
            let msg = "Enter all fields";
            if (!amount || !type) {
                let msg = "Enter all fields";
            } else if (95 <= amount <= 50000) {
                msg = "amount should be more than 95 and less then 50000.";
            }
            Swal.fire({
                title: msg,
                icon: "Error",
                confirmButtonText: "OK",
            });
        }
    };

    //use for decentro payout end

    const handleSubmitdata = () => {
        if (amount && amount >= 95 && amount <= 20000 && type) {
            // e.preventDefault();
            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };

            axios
                .post(
                    baseURL + `/withdraw/bank`,
                    {
                        amount,
                        type,
                    },
                    { headers }
                )
                .then((res) => {
                    setTimeout(() => {
                        getUser();
                    }, 5000);
                    setMount(false);

                    if (res.data.subCode === "200") {

                        Swal.fire({
                            title: res.data.message,
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        Swal.fire({
                            title: res.data.message,
                            icon: "danger",
                            confirmButtonText: "OK",
                        });
                    }
                })
                .catch((e) => {
                    setMount(false);
                    Swal.fire({
                        title: "Error! try after sometime.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    console.log(e);
                });
        } else {
            setMount(false);
            let msg = "Enter all fields";
            if (!amount || !type) {
                let msg = "Enter all fields";
            } else if (95 <= amount <= 20000) {
                msg = "amount should be more than 95 and less then 100000.";
            }
            Swal.fire({
                title: msg,
                icon: "Error",
                confirmButtonText: "OK",
            });
        }
    };

    const withReqComes = async () => {
        try {
            setMount(true);

            if (type == "upi") {
                var payment_gatway = "manualupi";
            } else if (type == "manualupi") {
                var payment_gatway = "manualupi";
            } else {
                var payment_gatway = "decentro";
            }

            const access_token = localStorage.getItem("access_token");
            const headers = {
                Authorization: `Bearer ${access_token}`,
            };
            await axios
                .post(
                    baseURL + `/withdraw/request`,
                    {
                        amount,
                        type,
                        payment_gatway,
                    },
                    { headers }
                )
                .then((res) => {
                    getUser();
                    if (res.data.success) {
                        setAmount('')
                        Swal.fire({
                            title: res.data.msg,
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        // setUpi_id()
                        setAmount('')
                        Swal.fire({
                            title: res.data.msg,
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                    setMount(false);
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpi = (e) => {
        // setErrorMessage('');
        setUpi_id(e.target.value);
    }
    const handleConfirmupi = (e) => {
        // setErrorMessage('');
        setConfirmUpiId(e.target.value);
    }
    const handleAmount = (e) => {
        // setErrorMessage('');
        setAmount(+e.target.value);
    }

    return (
        <>
            <section id="main-bg">
                <div id="wallet-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent userData={user} />
                        </div>
                        <div className="col-12 my-3">
                            <div className="row align-items-center my-2">
                                <div className="my-auto col-6 text-white" onClick={() => navigate('/WalletPage')}>
                                    <button type="button" className="btn btn-primary d-flex "><span className="material-symbols-outlined mb-0">arrow_back</span>Back</button>
                                </div>
                                <div className="col-6 d-flex justify-content-end">
                                    <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="guide-btn" className="btn btn-outline-primary bg-light">Guide</button>
                                    {/* Modal */}
                                    <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Guide Vedio</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                                </div>
                                                <div className="modal-body">
                                                    <iframe width="100%" height="350px" src="https://www.youtube.com/embed/38y_1EWIE9I" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-12 card mt-3 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="text-center">Payment Mode</div>
                            <div className="card-body walletbody mt-2">
                                <div className="col-12 py-3 ">
                                    <h6 className="text-center text-purple">Withdraw Chips: <span>7.00</span></h6>
                                </div>
                                <div className="col-12 d-flex justify-content-between">
                                    <p className="text-light">Minimum:95</p>
                                    <p className="text-light text-end">Maximum:1,00,000</p>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-12 card mt-3 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="text-center">Payment Details</div>
                            <div className="card-body walletbody mt-2">
                                {user?.verified === 'verified' && <>
                                    <div className="col-12 my-1">
                                        <label htmlFor="username" className="text-left text-yellow">UPI ID</label>
                                    </div>
                                    <div className="col-12 mb-4">
                                        <input type="text" className="details" placeholder="1234567890@paytm" value={upi_id} onChange={(e) => { handleUpi(e) }} />
                                    </div>
                                    {/* <div className="col-12 my-1">
                                        <label htmlFor="username" className="text-left text-yellow" >Re Enter UPI ID</label>
                                    </div>
                                    <div className="col-12 mb-4">
                                        <input type="text" className="details" placeholder="1234567890@paytm" onChange={(e) => { handleConfirmupi(e) }} />
                                    </div> */}
                                    <div className="col-12 my-1">
                                        <label htmlFor="username" className="text-left text-yellow">Cash</label>
                                    </div>
                                    <div className="col-12 mb-4">
                                        <input type="number" className="details" placeholder="Cash" value={amount} onChange={(e) => { handleAmount(e) }} />
                                    </div>
                                    <div className="col-12">
                                        <p className="lh-md text-center text-light">
                                            By Continuing You agree to our <a href="legalterms.html"> Legal Terms</a> and you are 18 years or older.
                                        </p>
                                    </div>
                                    {/* {errorMessage && (
                                        <div className="col-12 text-danger text-center mt-3">{errorMessage}</div>
                                    )} */}
                                    {/* {isLoading && <p>Loading...</p>} */}
                                    <div className="col-12">
                                        <button disabled={Boolean(submitBtn) ? false : true} onClick={updateBankDetails} className="bg-orange btn">{Boolean(submitBtn) ? "Withdraw" : "Reload Page"}</button>
                                    </div>

                                </>}
                                {user && user.verified === "unverified" && (
                                    <div className='text-center' style={{ height: "30px", color: 'white', fontWeight: '700' }}>
                                        {/* <picture className="ml-3">
                                            <img
                                                src="/images/alert.svg"
                                                alt=""
                                                width="32px"
                                                className="mt-4"
                                            />
                                        </picture> */}
                                        <div className="" style={{ color: 'white', fontWeight: '700' }}>
                                            Complete KYC to take Withdrawals
                                        </div>
                                    </div>
                                )}
                                {user && user.verified === "pending" && (
                                    <div className='text-center' style={{ height: "30px", color: 'white', fontWeight: '700' }}>
                                        {/* <picture className="ml-3">
                                            <img
                                                src="/images/alert.svg"
                                                alt=""
                                                width="32px"
                                                className="mt-4"
                                            />
                                        </picture> */}
                                        <div className="" style={{ color: 'white', fontWeight: '700' }}>
                                            Please wait your kyc under process
                                        </div>
                                    </div>
                                )}
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

export default WithDrawPage;