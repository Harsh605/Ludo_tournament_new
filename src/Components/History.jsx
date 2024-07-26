import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import { baseURL, token } from '../token';
import axios from 'axios';
import Logo from '../styles/logo.jpg'

function HistoryPage() {
    const [selectedType, setSelectedType] = useState('classic');
    const [wallettransaction, setWalletTransaction] = useState([]);
    const [cointransaction, setCoinTransaction] = useState([]);
    const [accessUserId, setAccessUserID] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [userData, setUserData] = useState({});
    const [itemsPerPage, setItemsPerPage] = useState(6); // Number of items to display per page

    const fetchdata = async (transactiontype) => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const responsedetails = await axios.get(baseURL + '/user', {
                headers: headers,
            });
            setAccessUserID(responsedetails.data.data.id);

            const response = await axios.get(baseURL + '/user/transaction', {
                headers: headers,
            });

            if (transactiontype === 'coinTransaction') {
                setCoinTransaction(response.data.data.coinTransaction);
            } else if (transactiontype === 'moneyTransaction') {
                setWalletTransaction(response.data.data.moneyTransaction);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // const MyData = async () => {
    //     try {
    //         const accessToken = localStorage.getItem('access_token');
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    //         const responsedetails = await axios.get(baseURL + '/me', {
    //             headers: headers,
    //         });
    //         console.log('responsedetails :>> ', responsedetails);
    //         setUserData(responsedetails.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    console.log('user :>> ', userData);

    const handleClassic = () => {
        setSelectedType('classic');
        fetchdata('coinTransaction');
    };

    const handleWallet = () => {
        setSelectedType('wallet');
        fetchdata('moneyTransaction');
    };

    const selectedTransactionData = selectedType === 'classic' ? cointransaction : wallettransaction;

    // Calculate the total number of pages based on the data and itemsPerPage
    const totalPages = Math.ceil(selectedTransactionData.length / itemsPerPage);

    // Calculate the index range for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the data to display only the items for the current page
    const currentData = selectedTransactionData.slice(startIndex, endIndex);

    useEffect(() => {
        fetchdata('coinTransaction'); 
        MyData();// Fetch data based on the selected type when component mounts
    }, []); // Trigger useEffect when selectedType changes


    return (
        <>
            <section id="main-bg">
                <div id="challengeset-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent userData={userData} />
                        </div>
                        <div className="col-12 my-4">
                            <button className="history-btn rounded-pill mx-2" id="classic-btn" onClick={handleClassic}>Classic</button>
                            <button className="history-btn rounded-pill mx-2" id="wallet-btn" onClick={handleWallet}>Wallet</button>
                        </div>
                    </div>
                    <div className="row" id="all">
                        <div className="col-12">
                            {currentData.map(item => (
                                <div key={item.id} className="row bg-light p-1 mb-2">
                                    <div className="col-3 border-end d-flex" >
                                        <img src='./images/img.jpg' className="rounded-circle" style={{ width: '20%' }} alt="" />
                                        <span className="mb-0"><strong>{item.Sender.username}</strong></span>
                                    </div>
                                    <div className="col-9">
                                        <div className="row">
                                            <div className="col-12 d-flex justify-content-between ">
                                                <h6 className="mb-0"><strong>{item.message}</strong></h6>
                                                <h6 className="mb-0"><strong>{item.Receiver.username}</strong></h6>
                                                <h6 className={`mb-0 text-end ${item.amount < 0 ? 'text-danger' : 'text-success'}`}>
                                                    ({item.sender === accessUserId ? '+' : '-'}){item.amount}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-12 d-flex justify-content-center my-3">
                            <button
                                className="btn btn-primary mx-2"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="bi bi-caret-left-square-fill" />
                            </button>
                            <button
                                className="btn btn-primary mx-2"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="bi bi-caret-left" /> Previous
                            </button>
                            <button
                                className="btn btn-primary mx-2"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}

                            >
                                Next <i className="bi bi-caret-right" />
                            </button>
                            <button
                                className="btn btn-primary mx-2"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                <i className="bi bi-caret-right-square-fill" />
                            </button>
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
    );
}

export default HistoryPage;
