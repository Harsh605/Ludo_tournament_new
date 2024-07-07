import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { handleUnAuthorized } from './hooks/handleUnAuthorized'
const $ = require("jquery")
$.Datatable = require("datatables.net");
// import { baseURL } from '../token';
const baseURL = 'http://84.247.133.7:5010/'

export default function UserView() {
    const location = useLocation();
    const navigate = useNavigate()
    const path = location.state.id;
    const [user, setUser] = useState();
    const [item, setVerify] = useState();
    const [challenge, setchallenge] = useState()
    const [txn, setTxn] = useState()
    const [txnwith, setTxnwith] = useState()
    const [referral, setReferral] = useState();
    const [kyc, setKyc] = useState();

    let [mismatchValue, setmismatchValue] = useState(0);
    let [HoldBalance, setHoldBalance] = useState(0);

    const getUser = () => {
        let access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `get_user/${path}`, { headers })
            .then((res) => {
                console.log(res.data);
                setUser(res.data)
                Allrefer(res.data.referral_code)
                setmismatchValue(res.data.Wallet_balance - (((res.data.wonAmount - res.data.loseAmount) + res.data.totalDeposit + res.data.referral_earning + res.data.totalBonus) - (res.data.totalWithdrawl + res.data.referral_wallet + res.data.withdraw_holdbalance + res.data.hold_balance + res.data.totalPenalty)));
                setHoldBalance(res.data.hold_balance);
            }).catch((e) => {
                console.log(e)
                handleUnAuthorized(e.response.data, navigate)
            })
    }

    const [referCount, setRefercount] = useState([])
    const Allrefer = async (id) => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseURL + `referral/code/${id}`, { headers })
            .then((res) => {
                setRefercount(res.data)
                console.log(res.data)

            })

    }





    const Allchallenge = async () => {
        const access_token = localStorage.getItem('access_token')
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `get_challange/user/${path}`, { headers })
            .then((res) => {
                setTxn(undefined)
                setTxnwith(undefined)
                setReferral(undefined)
                setKyc(undefined)
                setchallenge(res.data)
                $('table').dataTable();
            }).catch((e) => {
                console.log(e)
            })
    }

    const transactionHis = () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `txn_history/user/${path}`, { headers })
            .then((res) => {
                setchallenge(undefined);
                setReferral(undefined)
                setKyc(undefined)
                setTxnwith(undefined)
                setTxn(res.data)
                $('table').dataTable();
            }).catch((e) => {
                console.log(e)
            })
    }
    const withdrawalHis = () => {

        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `txnwith_history/user/${path}`, { headers })
            .then((res) => {
                setTxn(undefined)
                setchallenge(undefined)
                setReferral(undefined)
                setKyc(undefined)
                setTxnwith(res.data)
                $('table').dataTable();
            }).catch((e) => {
                console.log(e)
            })
    }

    const dateFormat = (e) => {
        const date = new Date(e);
        const newDate = date.toLocaleString('default', { month: 'long', day: 'numeric', hour: 'numeric', hour12: true, minute: 'numeric' });
        return newDate;
    }

    const referralHis = async () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseURL + `referral/code/winn/${user.referral_code}`, { headers })
            .then((res) => {
                setchallenge(undefined);
                setTxn(undefined)
                setTxnwith(undefined)
                setKyc(undefined);
                setReferral(res.data)
                console.log(res.data)
                $('table').dataTable();
            }).catch((e) => {
                console.log(e)
            })

    }

    const getKyc = () => {

        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseURL + `admin/user/kyc/${path}`, { headers })
            .then((res) => {
                setTxn(undefined)
                setTxnwith(undefined)
                setReferral(undefined)
                setchallenge(undefined)
                setKyc(res.data)

                // console.log(res.data);
                $('table').dataTable();
                setTimeout(() => imageViewer(), 700)
            })
    }

    function imageViewer() {
        let imgs = document.getElementsByClassName("img"),
            out = document.getElementsByClassName("img-out")[0];
        for (let i = 0; i < imgs.length; i++) {
            if (!imgs[i].classList.contains("el")) {

                imgs[i].classList.add("el");
                imgs[i].addEventListener("click", lightImage);
                function lightImage() {
                    let container = document.getElementsByClassName("img-panel")[i];
                    container.classList.toggle("img-panel__selct");
                };

                imgs[i].addEventListener("click", openImage);
                function openImage() {
                    let imgElement = document.createElement("img"),
                        imgWrapper = document.createElement("div"),
                        imgClose = document.createElement("div"),
                        container = document.getElementsByClassName("img-panel")[i];
                    container.classList.add("img-panel__selct");
                    imgElement.setAttribute("class", "image__selected");
                    imgElement.src = imgs[i].src;
                    imgWrapper.setAttribute("class", "img-wrapper");
                    imgClose.setAttribute("class", "img-close");
                    imgWrapper.appendChild(imgElement);
                    imgWrapper.appendChild(imgClose);


                    setTimeout(
                        function () {
                            imgWrapper.classList.add("img-wrapper__initial");
                            imgElement.classList.add("img-selected-initial");
                        }, 50);

                    out.appendChild(imgWrapper);
                    imgClose.addEventListener("click", function () {
                        container.classList.remove("img-panel__selct");
                        out.removeChild(imgWrapper);
                    });
                }
            }
        }
    }
    const update = (Id) => {


        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.patch(baseURL + `aadharcard/${Id}`,
            { verified: "verified" },
            { headers })
            .then((res) => {
                getUser();
                getKyc();
            })


    }


    const updateMismatch = (Id) => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.patch(baseURL + `user/missmatch/clear/${Id}`,
            { headers })
            .then((res) => {
                getUser();
                console.log(res);
            })
    }


    const updateHold = (Id) => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.patch(baseURL + `user/Hold/clear/${Id}`,
            { headers })
            .then((res) => {
                getUser();
                console.log(res);
            })
    }

    const checkfailedpayout = (txn_id, referenceId) => {

        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.post(baseURL + `payout/response/api`, { txn_id, referenceId }, { headers })
            .then((res) => {
                const icon = res.data.status == "SUCCESS" ? "success" : "danger";
                const title = res.data.status == "SUCCESS" ? "Withdraw successfully" : "Transaction Proccessing or Failed";

            })
            .catch((e) => {
                if (e.response.status == 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('token');
                    window.location.reload()
                }
            })
    }


    const deletedata = (Id) => {

        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.patch(baseURL + `aadharcard/${Id}`,
            { verified: "reject" },
            { headers })
            .then((res) => {
                getUser();
                getKyc();
            })

    }
    useEffect(() => {
        getUser();
        Allchallenge();
        getKyc();
    }, [])



    return (
        <>
            {Boolean(user) &&
                <>
                    <div className="img-out"></div>
                    <div className='row mt-5'>
                        <div className='col-lg-6 mb-4' >
                            <div className='card shadow-lg h-100 ' style={{ backgroundColor: '#a6a6ff' }}>
                                <div className='card-header'>
                                    <span style={{ fontWeight: '800' }}>User Details</span>
                                </div>
                                <ul className="list-group list-group-flush" style={{ backgroundColor: '#a6a6ff' }}>
                                    {(user && user.avatar) && <li className="list-group-item  style={{backgroundColor: '#a6a6ff'}}img-panel" style={{ backgroundColor: '#a6a6ff' }}>Profile Pic :<img className="img" src={baseURL + `${user.avatar}`} alt="Profile" style={{
                                        borderRadius: '5px',
                                        width: '4rem',
                                        height: '4rem',
                                    }}
                                    /> </li>}
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Name : {user.Name}</li>

                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>verified : <span className={`badge badge-pill ${user.verified == "verified" ? 'badge-success' : 'badge-danger'}`}>{user.verified}</span></li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Phone : {user.Phone}</li>

                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Wallet balance : {user.Wallet_balance}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Withdrawal Amount balance : {user.withdrawAmount}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Withdrawal Hold balance : {user.withdraw_holdbalance}

                                        <div class="col" style={{ color: '#8c8c8c' }}>
                                            Note: If hold balance not 0 user can't make new Withdrawal request</div></li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Referral balance : {user.referral_wallet}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Referral count : {referCount && referCount}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Referral earning : {user.referral_earning}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>total Deposit : {user.totalDeposit}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>total Withdrawal : {user.totalWithdrawl}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>total Bonus : {user.totalBonus}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>total Penalty : {user.totalPenalty}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>hold balance : {HoldBalance}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Won amount : {user.wonAmount}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Lose amount : {user.loseAmount}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Calculated wallet balance : {((user.wonAmount - user.loseAmount) + user.totalDeposit + user.referral_earning + user.totalBonus) - (user.totalWithdrawl + user.referral_wallet + user.withdraw_holdbalance + user.hold_balance + user.totalPenalty)}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Mismatch wallet balance : {mismatchValue}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Referral code : {user.referral_code}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Referral by : {user.referral}</li>

                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Account created at : {dateFormat(user.createdAt).split(',')[0]}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Account updated at : {dateFormat(user.updatedAt).split(',')[0]}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-6 mb-4'>
                            <div className='card shadow-lg h-100 ' style={{ backgroundColor: '#a6a6ff' }}>
                                <div className='card-header'>
                                    <span style={{ fontWeight: '800' }}>Bank Details</span>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Account holder name : {user.holder_name}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>IFSC code : {user.ifsc_code}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Account number : {user.account_number}</li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>UPI ID : {user.upi_id}</li>
                                </ul>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Mismatch: <button disabled={mismatchValue == 0} onClick={() => updateMismatch(user._id)} className='btn btn-success'>CLEAR ({mismatchValue})</button></li>
                                    <li className="list-group-item" style={{ backgroundColor: '#a6a6ff' }}>Hold : <button disabled={mismatchValue == 0} onClick={() => updateHold(user._id)} className='btn btn-success'>CLEAR ({HoldBalance})</button> </li>
                                </ul>
                            </div>
                        </div>

                    </div>


                    <div className="row ">
                        <div className="col-12 grid-margin">
                            <div className="card">
                                <div className="card-body" style={{ backgroundColor: '#a6a6ff' }}>
                                    <button className={Boolean(challenge) ? `btn btn-success mb-3 mr-2` : `btn btn-info mb-3 mr-2`} onClick={Allchallenge}>Game History</button>

                                    <button className={Boolean(txn) ? `btn btn-success mb-3 mr-2` : `btn btn-info mb-3 mr-2`} onClick={transactionHis}>Deposit History</button>
                                    <button className={Boolean(txnwith) ? `btn btn-success mb-3 mr-2` : `btn btn-info mb-3 mr-2`} onClick={withdrawalHis}>withdrawal History</button>
                                    <button className={Boolean(referral) ? `btn btn-success mb-3 mr-2` : `btn btn-info mb-3 mr-2`} onClick={referralHis}>Referral History</button>
                                    <button className={Boolean(kyc) ? `btn btn-success mb-3 mr-2` : `btn btn-info mb-3 mr-2`} onClick={getKyc}>KYC</button>
                                    {Boolean(challenge) && <div className="table-responsive">
                                        <table className="table" >
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th> ID</th>
                                                    <th> Creator</th>
                                                    <th> Accepter</th>
                                                    <th> Room Code</th>
                                                    <th> Amount </th>
                                                    <th> Win/Lose Amt </th>
                                                    <th> closing balance</th>
                                                    <th> Status </th>
                                                    <th> Game Type </th>
                                                    <th> Winner </th>
                                                    <th> Date </th>
                                                    <th> Action </th>
                                                </tr>

                                            </thead>

                                            <tbody>
                                                {challenge.map((game, key) => (
                                                    <tr key={key}>
                                                        <td>{key + 1}</td>
                                                        <td>{game._id}</td>
                                                        <td>
                                                            <span className="pl-2 ">{game.Created_by.Name}</span>
                                                        </td>

                                                        <td>
                                                            <span className="pl-2">{game.Accepetd_By ? game.Accepetd_By.Name : null}</span>
                                                        </td>
                                                        <td>{game.Room_code}</td>
                                                        <td>{game.Game_Ammount}</td>

                                                        <td>
                                                            {game.Winner ? ((user._id == game.Winner._id) ? '+' + game.winnAmount : '-' + game.Game_Ammount) : ((user._id == game.Created_by._id ? game.winnAmount : '-' + game.winnAmount))}

                                                        </td>

                                                        <td>{game.Winner ? ((user._id == game.Winner._id) ? game.Winner_closingbalance : game.Loser_closingbalance) : ((user._id == game.Created_by._id ? game.Loser_closingbalance : game.Winner_closingbalance))}</td>
                                                        <td className='text-primary font-weight-bold'>{game.Status}</td>
                                                        <td>{game.Game_type}</td>
                                                        <td>{game.Winner ? game.Winner.Name : null}</td>
                                                        <td>{dateFormat(game.updatedAt).split(',')[0]} </td>
                                                        <td>

                                                            {/* <Link type='button' className="btn btn-primary mx-1" to={`/view/${game._id}`}>View</Link> */}
                                                            <Link type='button' className="btn btn-primary mx-1" to={`/view/${game._id}`}>View</Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>}
                                    {Boolean(txn) && <div className="table-responsive">

                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th> ID</th>

                                                    <th> Amount </th>
                                                    <th> Closing balance</th>
                                                    <th> Status </th>
                                                    <th> Payment gatway </th>
                                                    <th> Date </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {txn.map((data, key) => (
                                                    <tr key={key}>
                                                        <td>{key + 1}</td>
                                                        <td>{data._id}</td>

                                                        <td>{data.amount}</td>
                                                        <td> {data.closing_balance}</td>

                                                        <td className='font-weight-bold text-success'>{data.status}</td>
                                                        <td> {(data.payment_gatway) ? data.payment_gatway : ''}</td>
                                                        <td>{dateFormat(data.updatedAt).split(',')[0]} </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>}
                                    {Boolean(txnwith) && <div className="table-responsive">

                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th> ID</th>

                                                    <th> type</th>
                                                    <th> Amount </th>
                                                    <th> Closing balance</th>
                                                    <th> Status </th>
                                                    <th> Action </th>
                                                    <th> Date </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {txnwith && txnwith.map((data, key) => (
                                                    <tr>
                                                        <td>{key + 1}</td>
                                                        <td>{data._id}</td>


                                                        <td>
                                                            <span className="pl-2">{data.Withdraw_type}</span>
                                                        </td>
                                                        <td>{data.amount}</td>
                                                        <td> {data.closing_balance}</td>
                                                        <td className='font-weight-bold text-success'>{data.status}</td>
                                                        <td>
                                                            {
                                                                //&& data.status != 'FAILED'
                                                                (data.status != 'SUCCESS' && data.amount == user.withdraw_holdbalance) ? <button className="btn btn-danger" onClick={() => checkfailedpayout(data.payment_gatway, data._id, data.referenceId)} >Check {data.payment_gatway}</button> : 'Checked'
                                                            }
                                                        </td>
                                                        <td>{dateFormat(data.updatedAt).split(',')[0]}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>}
                                    {Boolean(referral) && <div className="table-responsive">
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th> ID</th>
                                                    <th> Earned by</th>
                                                    <th> Amount </th>
                                                    <th> Closing balance</th>
                                                    <th> Date </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {referral.map((data, key) => (
                                                    <tr key={key}>
                                                        <td>{key + 1}</td>
                                                        <td>{data._id}</td>
                                                        <td>
                                                            {data.earned_from.Name}
                                                        </td>
                                                        <td>{data.amount}</td>
                                                        <td>
                                                            {data.closing_balance}
                                                        </td>
                                                        <td>{dateFormat(data.updatedAt).split(',')[0]} </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>}
                                    {Boolean(kyc) && <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th> ID</th>

                                                    <th>Doc name</th>
                                                    <th> Aadhar no</th>

                                                    <th>DOB</th>
                                                    <th> Document-Front</th>
                                                    <th> Document-Back</th>
                                                    <th> status </th>
                                                    <th>Date</th>
                                                    <th> Approve or Reject </th>
                                                    {/* <th> View </th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {kyc && kyc.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item._id}</td>

                                                        <td>{item.Name}</td>

                                                        <td>{item.Number}</td>
                                                        <td>{item.DOB}</td>
                                                        <td>
                                                            <div className="img-panel">
                                                                <img className="img" src={baseURL + `${item.front}`} alt="kyc" style={{
                                                                    borderRadius: '5px',
                                                                    width: '4rem',
                                                                    height: '4rem',
                                                                }}
                                                                    id={`kyc${index}`}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="img-panel">
                                                                <img className="img" src={baseURL + `${item.back}`} alt="kyc" style={{
                                                                    borderRadius: '5px',
                                                                    width: '4rem',
                                                                    height: '4rem',
                                                                }}
                                                                    id={`kyc${index}`}
                                                                />
                                                            </div>
                                                        </td>


                                                        <td><span className={(item.verified === "reject") ? 'btn btn-danger' : 'btn btn-success'}>{item.verified}</span> </td>
                                                        <td>{dateFormat(item.updatedAt).split(',')[0]} </td>
                                                        <td>
                                                            <div style={{ width: '11pc' }}>
                                                                <button className="btn btn-success mr-1" disabled={(item.verified === "verified") ? true : false} onClick={() => update(item._id)}>Approve</button>
                                                                <button className="btn btn-danger" disabled={(item.verified === "verified") ? false : false} onClick={() => deletedata(item._id)}>Reject</button>
                                                            </div>

                                                        </td>
                                                        {/* <td><Link to="/user/view" className="btn btn-primary">View</Link></td> */}
                                                    </tr>

                                                ))}
                                            </tbody>
                                        </table>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
        </>
    )
}
