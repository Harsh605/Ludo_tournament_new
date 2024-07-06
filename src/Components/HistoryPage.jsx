import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import { baseURL, token } from '../token';
import axios from 'axios';
// import Logo from '../styles/logo.jpg'
import Logo from './Logo';
import { Button, TablePagination, TextField } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function HistoryPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const id = location.state.id
    const [selectedType, setSelectedType] = useState('classic');
    const [wallettransaction, setWalletTransaction] = useState([]);
    const [userData, setUserData] = useState({});
    const [cointransaction, setCoinTransaction] = useState([]);
    const [accessUserId, setAccessUserID] = useState(0);
    const [statusdata, setStatusData] = useState([]);
    const [withdrawdata, setWithdrawdata] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [amount, setAmount] = useState("");
    const [challenges, setChallenges] = useState([]);
    // const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]); // Store the data for the current page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState()
    const [game, setGame] = useState()

    const itemsPerPage = 4;

    // Calculate start and end indexes for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    let limit = 50;
    const [pageNumber, setPageNumber] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);

    const role = async () => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseURL + `/me`, { headers })
            .then((res) => {
                setUser(res.data)

                //Allgames(res.data._id)
                if (id === 1) {
                    Allgames(res.data?._id, currentPage, limit)
                }
                if (id === 2)
                    fetchamountstatus(res.data?._id)
                // window.location.reload()

            })

    }
    const Allgames = async (id) => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseURL + `/temp/deposite/${id}?page=${pageNumber}&_limit=${limit}`, { headers })
            .then((res) => {
                setCoinTransaction(res.data.ress)
                setCurrentData(res.data.ress)
                setCurrentPage(res.data.totalPages);

            })

    }
    // const fetchtransaction = async () => {
    //     try {
    //         const accessToken = localStorage.getItem('access_token');
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    //         const response = await axios.get(baseURL + '/user/wallet', {
    //             headers: headers,
    //         });
    //         console.log(response.data);
    //         setAmount(response.data.data.amount);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    // const fetchdata = async (transactiontype) => {
    //     try {
    //         const accessToken = localStorage.getItem('access_token');
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    //         console.log("response1111")

    //         const responsedetails = await axios.get(baseURL + '/user', {
    //             headers: headers,
    //         });
    //         // setAccessUserID(responsedetails.data.data.id);

    //         const response = await axios.get(baseURL + '/user/transaction', {
    //             headers: headers,
    //         });

    //         if (transactiontype === 'coinTransaction') {
    //             setCoinTransaction(response?.data?.data?.coinTransaction);
    //         }
    //         // else if (transactiontype === 'moneyTransaction') {
    //         //     setWalletTransaction(response.data.data.moneyTransaction);
    //         // }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const fetchamountstatus = async (userId) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const responsedetails = await axios.get(baseURL + `/game/history/user/${userId}?page=${pageNumber}&_limit=${limit}`, {
                headers: headers,
            });
            let gameHis = [];
            responsedetails.data.data.forEach((ele) => {
                if (ele.Status == 'completed' || ele.Status == 'cancelled' || ele.Status == 'conflict') {
                    gameHis.push(ele);
                }
            })
            console.log(gameHis, "jasdhjskgfsdhgf")
            setStatusData(gameHis);
            setSelectedType('status')
            setNumberOfPages(responsedetails.data.totalPages);
            // setWithdrawdata(responsedetails?.data?.data?.withdrawRequest);

        } catch (error) {
            console.error(error);
        }
    };

    const handleClassic = () => {
        setSelectedType('classic');
        // fetchdata('coinTransaction');
        // fetchtransaction();
        setCurrentPage(1); // Reset the current page when switching options
    };

    const handleWallet = () => {
        setSelectedType('status');
        fetchamountstatus();
        // fetchtransaction();
        setCurrentPage(1); // Reset the current page when switching options
    };

    const selectedTransactionData = selectedType === 'classic' ? cointransaction : wallettransaction;

    // const currentTransactionData = selectedTransactionData.slice(startIndex, endIndex);
    const fetchchallenges = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const responsedetails = await axios.get(baseURL + '/challenge/played', {
                headers: headers,
            });
            setChallenges(responsedetails?.data?.data?.rows)
        } catch (error) {
            console.error(error);
        }
    }
    const handleChallenges = () => {
        setSelectedType("challenges");
        fetchchallenges();
        setCurrentPage(1); // Reset the current page when switching options
    }
    // useEffect(() => {
    //     // fetchtransaction();
    //     fetchdata('coinTransaction'); // Fetch data based on the selected type when component mounts
    // }, []); // Trigger useEffect when selectedType changes


    useEffect(() => {
        // Update the current data when the selected type or page changes
        // if (selectedType === 'classic') {
        //     setCurrentData(cointransaction);
        // } else if (selectedType === 'status') {
        //     setCurrentData(statusdata);
        // } else if (selectedType === 'challenges') {
        //     setCurrentData(challenges);
        // }
        if (!id)
            navigate(-1)
        // Calculate the total number of pages based on the current data and itemsPerPage
        // setTotalPages(Math.ceil(currentData.length / itemsPerPage));
    }, [selectedType, currentData]);

    const MyData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const responsedetails = await axios.get(baseURL + '/me', {
                headers: headers,
            });
            setUserData(responsedetails.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        role()
        MyData()
    }, [currentPage])




    // Slice the current data to display only the items for the current page
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setImageSrc("");
    };
    const handleOpenDialog = (imageUrl) => {
        setOpenDialog(true);
        setImageSrc(imageUrl);
    };
    return (
        <>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Image</DialogTitle>
                <DialogContent>
                    {/* Add your dialog content here */}
                    {imageSrc ? <img src={`https://backened.khelludokhel.info/api/v1/image/${imageSrc}`} alt="Preview" /> : 'Loading...'}
                    {/* <p>This is the dialog content.</p> */}
                </DialogContent>
            </Dialog>
            <section id="main-bg">
                <div id="challengeset-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent userData={userData} />
                        </div>
                        {/* <div className="col-12 my-4 type-history">
                            <button className="history-btn rounded-pill mx-2" id="classic-btn" onClick={handleClassic}>Transactions</button>
                            <button className="history-btn rounded-pill mx-2" id="wallet-btn" onClick={handleWallet}>Game History</button>
                            <button className="history-btn rounded-pill mx-2" id="wallet-btn" onClick={handleChallenges}>All Challenges</button>
                        </div> */}
                    </div>
                    <div className="row mt-4" id="all">
                        <div className="col-12">
                            {selectedType === "classic" &&
                                currentData?.map(item => {
                                    // Extract date and time from "createdAt"
                                    const createdAtDate = new Date(item?.createdAt);
                                    const date = createdAtDate.toLocaleDateString(); // Extract date
                                    const time = createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extract time
                                    if ((item.Req_type === 'deposit' || item.Req_type === 'bonus') && item.status != 'FAILED') {
                                        var titleMsg = 'Cash added';
                                        if (item.status === 'Pending' && item.Req_type === "deposit") {
                                            var signIcon = <div className="text-danger">X{item?.amount}</div>;
                                        } else {
                                            var signIcon = <div className="text-success">+{item?.amount}</div>;
                                        }
                                    }
                                    else if (item.Req_type === "withdraw" && item.status != 'FAILED') {
                                        var titleMsg = 'Witdraw using ' + item.Withdraw_type;
                                        var signIcon = <div className="text-danger">-{item?.amount}</div>;
                                    }
                                    else if (item.Req_type === 'penalty' && item.status != 'FAILED') {
                                        var titleMsg = 'Penalty';
                                        var signIcon = <div className="text-danger">-{item?.amount}</div>;
                                    }
                                    else if (item.status === 'Pending' || item.status === 'FAILED') {
                                        var titleMsg = 'FAILED';
                                        var signIcon = <div className="text-danger">X{item?.amount}</div>;
                                    }
                                    else {
                                        var titleMsg = '';
                                        var signIcon = <div className="text-success"></div>;
                                    }
                                    return (
                                        <div key={item?.id} className="transaction-item" style={{ fontSize: "15px" }}>
                                            <div className="row bg-light p-2 mb-3 rounded">
                                                <div className="col-2 border-end d-flex flex-column align-items-center justify-content-center">
                                                    <img src="./images/img.jpg" className="rounded-circle" style={{ width: '30px', height: '30px' }} alt="" />
                                                    <div className="d-flex flex-column align-items-center">
                                                        <p className="mb-0 time" style={{ color: 'black' }}>{time}</p>
                                                        <p className="mb-0 date" style={{ color: 'black' }}>{date}</p>
                                                    </div>
                                                </div>
                                                <div className="col-8 d-flex flex-column justify-content-center">
                                                    <h5 className="mb-0" style={{ color: 'black' }}><strong>{titleMsg}</strong></h5>
                                                    <div className="row mt-2">
                                                        <div className="col-12">
                                                            <p className="mb-0" style={{ color: 'black' }}><strong>Sender:</strong> {item?.status}</p>
                                                        </div>
                                                        {/* <div className="col-7">
                                                            <p className="mb-0"><strong>Receiver:</strong> {item?.Receiver?.username}</p>
                                                        </div> */}
                                                        {/* <div className="col-7">
                                                            <p className="mb-0"><strong>Clos:</strong> {item?.message}</p>
                                                        </div> */}
                                                    </div>
                                                </div>
                                                <div className="col-2 border-start d-flex flex-column align-items-center ">
                                                    <h5>
                                                        {signIcon}
                                                    </h5>
                                                    <h5 className="mb-0" style={{ margin: '0', fontSize: "13px" }}><strong>closing balance:- </strong>{item?.closing_balance ? item?.closing_balance : "0"}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            {selectedType == "status" &&
                                statusdata?.map(item => {
                                    // Extract date and time from "createdAt"
                                    const createdAtDate = new Date(item?.createdAt);
                                    const date = createdAtDate.toLocaleDateString(); // Extract date
                                    const time = createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extract time

                                    return (
                                        <div key={item?.id} className="transaction-item" style={{ fontSize: "15px" }}>
                                            <div className="row bg-light p-2 mb-3 rounded">
                                                <div className="col-2 border-end d-flex flex-column align-items-center justify-content-center">
                                                    <img src="./images/img.jpg" className="rounded-circle" style={{ width: '30px', height: '30px' }} alt="" />
                                                    <div className="d-flex flex-column align-items-center">
                                                        <p className="mb-0 time text-black">{time}</p>
                                                        <p className="mb-0 date text-black">{date}</p>
                                                    </div>
                                                </div>
                                                <div className="col-8 d-flex flex-column justify-content-center">
                                                    <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Status:- </strong>{item.Status === "completed" ? (item.Winner && item.Winner?._id === user?._id ? 'Win Against' : 'Lost Against') : item.Status} <b>{item.Accepetd_By && item.Accepetd_By?._id === user?._id ? item.Created_by.Name : item.Accepetd_By && item.Accepetd_By.Name}</b></h5>
                                                    <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Battle Id:- </strong>{item?._id}</h5>
                                                    {/* <div className=" mb-0 row col-2">
                                                        <Button color="primary" className="ml-auto" onClick={() => handleOpenDialog(item?.image)}>
                                                            <Visibility />
                                                        </Button>
                                                    </div> */}
                                                </div>
                                                <div className="col-2 border-start d-flex flex-column align-items-center ">
                                                    <h5 className={`mb-0 ${item?.amount < 0 ? 'text-danger' : 'text-success'}`}>
                                                        {item.Status === "completed" ? (item.Winner?._id === user?._id ? `(+) ${item?.winnAmount}` : `(-) ${item?.Game_Ammount}`) : ''}
                                                    </h5>
                                                    <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>closing balance : </strong>{item.Winner?._id === user?._id ? item.Winner_closingbalance : item.Loser_closingbalance}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            {withdrawdata && withdrawdata?.map(item => {
                                // Extract date and time from "createdAt"
                                const createdAtDate = new Date(item?.createdAt);
                                const date = createdAtDate.toLocaleDateString(); // Extract date
                                const time = createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extract time

                                return (
                                    <div key={item?.id} className="transaction-item" style={{ fontSize: "15px" }}>
                                        <div className="row bg-light p-2 mb-3 rounded">
                                            <div className="col-2 border-end d-flex flex-column align-items-center justify-content-center">
                                                <img src="./images/img.jpg" className="rounded-circle" style={{ width: '30px', height: '30px' }} alt="" />
                                                <div className="d-flex flex-column align-items-center">
                                                    <p className="mb-0 time">{time}</p>
                                                    <p className="mb-0 date">{date}</p>
                                                </div>
                                            </div>
                                            <div className="col-8 d-flex flex-column justify-content-center">
                                                <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Status:- </strong>{item?.status}</h5>
                                                <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Message:- </strong>{item?.message}</h5>
                                            </div>
                                            <div className="col-2 border-start d-flex flex-column align-items-center ">
                                                <h5 className={`mb-0 ${item?.amount < 0 ? 'text-danger' : 'text-success'}`}>
                                                    -{item?.amount}
                                                </h5>
                                                <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Type:- </strong>withdraw</h5>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* } */}
                        {
                            selectedType == "challenges" &&
                            currentData?.map(item => {
                                // Extract date and time from "createdAt"
                                const createdAtDate = new Date(item?.createdAt);
                                const date = createdAtDate.toLocaleDateString(); // Extract date
                                const time = createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extract time

                                return (
                                    <div key={item?.id} className="transaction-item" style={{ fontSize: "15px" }}>
                                        <div className="row bg-light p-2 mb-3 rounded">
                                            <div className="col-2 border-end d-flex flex-column align-items-center justify-content-center">
                                                <img src="./images/img.jpg" className="rounded-circle" style={{ width: '30px', height: '30px' }} alt="" />
                                                <div className="d-flex flex-column align-items-center">
                                                    <p className="mb-0 time">{time}</p>
                                                    <p className="mb-0 date">{date}</p>
                                                </div>
                                            </div>
                                            <div className="col-8 d-flex flex-column justify-content-center">
                                                <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Status:- </strong>{item?.status}</h5>
                                                <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Roomcode:- </strong>{item?.roomcode}</h5>
                                                {/* <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Category:- </strong>{item?.category}</h5> */}

                                            </div>
                                            <div className="col-2 border-start d-flex flex-column align-items-center justify-content-center">
                                                <h5 className={`mb-0 ${item?.amount < 0 ? 'text-danger' : 'text-success'}`}>
                                                    {item?.price}
                                                </h5>
                                                {/* <h5 className="mb-0" style={{ margin: '0', fontSize: "15px" }}><strong>Amount:- </strong>{amount}</h5> */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="col-12 d-flex justify-content-center my-3">
                        <button
                            className="btn btn-primary mx-2"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <i className="bi bi-caret-left-square-fill" />
                        </button>
                        <button
                            className="btn btn-primary mx-2"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <i className="bi bi-caret-left" /> Previous
                        </button>
                        <button
                            className="btn btn-primary mx-2"
                            // disabled={endIndex >= data.length}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next <i className="bi bi-caret-right" />
                        </button>
                        <button
                            className="btn btn-primary mx-2"
                            // disabled={endIndex >= data.length}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <i className="bi bi-caret-right-square-fill" />
                        </button>
                    </div>
                </div>
                {/* </div> */}
                <div className="rightContainer" style={{ position: 'fixed', top: 0, bottom: 0, left: 900, zIndex: 5 }}>
                    <div className="rcBanner flex-center">
                        <Logo />
                        {/* <picture className="rcBanner-img-container">
                            <img style={{ width: "100% ", borderRadius: '50%' }} src="./images/Ludolkjpg.jpg" alt />
                        </picture>
                        <div className="rcBanner-text">Play Ludo  <span className="rcBanner-text-bold">Win Real Cash!</span></div>
                        <div className="rcBanner-footer">For best experience  , open&nbsp;<span style={{ cursor: "pointer", color: '#ffb900' }}>khelludokhel.info</span>
                            &nbsp;on&nbsp;&nbsp;chrome </div> */}
                    </div>
                </div>
            </section >
        </>
    );
}

export default HistoryPage;
