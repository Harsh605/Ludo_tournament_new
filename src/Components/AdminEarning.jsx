// import React, { useState } from 'react';
// import "./styles/AdminEarning.css"
// import axios from 'axios';
// import { baseURL } from '../token';
// import { TablePagination } from '@mui/material';
// import { useEffect } from 'react';

// export default function AdminEarning() {
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [totalEarning, setTotalEarning] = React.useState('5,00,000');
//     const [searchAmount, setSearchAmount] = React.useState('');
//     const [editingIndex, setEditingIndex] = useState(null);
//     const [initialRows, setInitialRows] = useState([]);
//     const [tabledata, setTabledata] = useState([]);


//     const columns = [
//         { id: 'number', label: 'Number', minWidth: 100 },
//         { id: 'id', label: 'ID', minWidth: 170 },
//         {
//             id: 'amount',
//             label: 'Amount',
//             minWidth: 170,
//             align: 'right',
//             format: (value) => value.toLocaleString('en-US'),
//         },
//     ];


//     //search amount method 
//     // const initialRows = [
//     //     { number: 1, id: 'user001', amount: 1000 },
//     //     { number: 2, id: 'user002', amount: 2000 },
//     //     { number: 3, id: 'user003', amount: 3000 },
//     //     { number: 4, id: 'user004', amount: 4000 },
//     //     { number: 5, id: 'user005', amount: 5000 },
//     //     { number: 6, id: 'user006', amount: 6000 },
//     //     { number: 7, id: 'user007', amount: 7000 },
//     //     { number: 8, id: 'user008', amount: 8000 },
//     //     { number: 9, id: 'user009', amount: 9000 },
//     //     { number: 10, id: 'user010', amount: 10000 },
//     //     { number: 11, id: 'user011', amount: 11000 },
//     //     { number: 12, id: 'user012', amount: 12000 },
//     //     { number: 13, id: 'user013', amount: 13000 },
//     //     { number: 14, id: 'user014', amount: 14000 },
//     //     { number: 15, id: 'user015', amount: 15000 },
//     //     { number: 16, id: 'user016', amount: 16000 },
//     //     { number: 17, id: 'user017', amount: 17000 },
//     //     { number: 18, id: 'user018', amount: 18000 },
//     //     { number: 19, id: 'user019', amount: 19000 },
//     //     { number: 20, id: 'user020', amount: 20000 },
//     //     { number: 21, id: 'user021', amount: 21000 },
//     //     { number: 22, id: 'user022', amount: 22000 },
//     //     { number: 23, id: 'user023', amount: 23000 },
//     //     { number: 24, id: 'user024', amount: 24000 },
//     //     { number: 25, id: 'user025', amount: 25000 },
//     // ];

//     const fetchAdminTransactions = async () => {
//         try {
//             const accessToken = localStorage.getItem('access_token');
//             const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

//             const response = await axios.get(`${baseURL}/user/transaction`, {
//                 headers: headers,
//             });

//             console.log(response.data);
//             if (response.status === 200) {
//                 // Filter transactions where the Receiver has a role of "admin"
//                 const coinTransactions = response.data.data.coinTransaction.filter(
//                     (transaction) => transaction.Receiver.role === 'admin'
//                 );
//                 const moneyTransactions = response.data.data.moneyTransaction.filter(
//                     (transaction) => transaction.Receiver.role === 'admin'
//                 );
//                 // Concatenate both arrays to collect all admin transactions
//                 const adminTransactions = [...coinTransactions, ...moneyTransactions];
//                 console.log(adminTransactions);
//                 setTabledata(adminTransactions)
//                 // return adminTransactions;
//             }
//         } catch (error) {
//             console.error('Error fetching admin transactions:', error);
//             // throw error;
//         }
//     };

//     useEffect(() => {
//         fetchAdminTransactions()
//     }, [])

//     const filteredData = initialRows.filter(data => {
//         if (!searchAmount) {
//             return true;
//         }
//         return data.amount.toString().includes(searchAmount);
//     });




//     const renderedTableRows = tabledata.map((data, index) => (
//         <tr role="row" key={index}>
//             <td>{index + 1}</td>
//             <td>{data.Receiver.username}</td>
//             <td>{data.amount}</td>
//         </tr>
//     ));



//     const handleSearchAmountChange = (e) => {
//         setSearchAmount(e.target.value);
//         setPage(0); // Reset page when search query changes
//     };

//     // pagination part 
//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     // Calculate the index range for the current page
//     const startIndex = page * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;

//     // pagination part 


import React, { useState, useEffect } from 'react';
import "./styles/AdminEarning.css"
import axios from 'axios';
import { baseURL } from '../token';
import { TablePagination } from '@mui/material';
import ReactPaginate from 'react-paginate';
import * as XLSX from "xlsx";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { handleUnAuthorized } from './hooks/handleUnAuthorized';

export default function AdminEarning() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalEarning, setTotalEarning] = useState('5,00,000');
    const [searchAmount, setSearchAmount] = useState('');
    const [noOfPage, setNoOfPage] = useState(0);
    const [initialRows, setInitialRows] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const fetchAdminTransactions = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            const response = await axios.get(`${baseURL}admin/Earning?page=${page}&_limit=${rowsPerPage}`, {
                headers: headers,
            });

            if (response.status === 200) {
                // const coinTransactions = response.data.data.coinTransaction.filter(
                //     (transaction) => transaction.Receiver.role === 'admin'
                // );
                // const moneyTransactions = response.data.data.moneyTransaction.filter(
                //     (transaction) => transaction.Receiver.role === 'admin'
                // );
                // const adminTransactions = [...coinTransactions, ...moneyTransactions];
                // setInitialRows(adminTransactions);
                // setPage(0)
                setNoOfPage(response?.data?.totalPages)
                setFilteredData(response.data.admin);
            }
        } catch (error) {
            console.error('Error fetching admin transactions:', error);
            handleUnAuthorized(error.response.data, navigate)
        }
    };

    useEffect(() => {
        fetchAdminTransactions();
    }, [rowsPerPage, page]);

    const handleChangePage = (data) => {
        setPage(data.selected + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const createDownloadData = () => {
        handleExport();
    };
    const handleExport = () => {
        let table1 = [
            {
                A: "id",
                B: "Amount"
                // F:"Bonus by (ID)"
            },
        ];

        filteredData.forEach((row) => {
            const Earing = row;
            //console.log("exldata", Earing);
            table1.push({
                A: `Earn From Challange ${Earing.Earned_Form} on ${moment(Earing.createdAt).format('YYYY MM DD || HH:mm:ss A')}`,
                B: Earing.Ammount,
                // F:(userDetails.action_by)?userDetails.action_by:'N/A'
            });
        });

        //table1 = [{A:"User Details"}].concat(table1);
        //const finalData = [...table1];
        //console.log(finalData);
        /* convert state to workbook */
        const ws = XLSX.utils.json_to_sheet(table1, {
            skipHeader: true,
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        /* generate XLSX file and send to client */
        XLSX.writeFile(wb, "AdminEarning.xlsx");
    };

    const renderedTableRows = filteredData?.map((data, index) => (
        <tr role="row" key={index}>
            <td>{index + 1 + (page - 1) * rowsPerPage}</td>
            <td>{data?.Earned_Form?.Name}</td>
            <td>{data.Ammount}</td>
        </tr>
    ));
    const handleSearchAmountChange = (e) => {
        setSearchAmount(e.target.value);
    };

    return (
        <>
            <div className='fade-in'>

                <div className="designing-main-div">
                    <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                        <span style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>Admin Earning</span>
                        <span style={{ float: 'right'}}>
                            <button
                            onClick={() => {
                                createDownloadData();
                            }}
                            className="btn btn-primary"
                        >
                            Export Data
                        </button></span>
                    </div>
                    <section style={{ marginTop: '5rem' }} className="content">
                        <div className="container-fluid" style={{ marginTop: '-35px' }}>
                            <div className="row">
                                <div className="col-12 mt-5">
                                    <div className="card">
                                        <div style={{ background: '#a6a6ff' }} className="card-body">
                                            <div className='row pl-3'>
                                                <select className='form-control col-sm-1 m-2' id='pagelimit' name='pagelimit' onChange={(e) => setRowsPerPage(+e.target.value)} style={{ backgroundColor: "whitesmoke" }}>
                                                    <option value="10">Set limit</option>
                                                    <option value="20">20</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                    <option value="500">500</option>
                                                </select>
                                            </div>
                                            <div className="single-table">
                                                <div className="table-responsive">
                                                    <div id="table_id_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                                                        {/* <div id="table_id_filter" className="dataTables_filter">
                                                            <label>
                                                                Search:
                                                                <input
                                                                    style={{ marginLeft: '0.1rem' }}
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={searchAmount}
                                                                    onChange={(e) => setSearchAmount(e.target.value)}
                                                                    placeholder="Search by Amount"
                                                                    aria-describedby="inputGroupPrepend"
                                                                    name="amount"
                                                                />
                                                            </label>
                                                        </div> */}
                                                        <table className="table text-center dataTable no-footer dtr-inline" id="table_id" role="grid" aria-describedby="table_id_info">
                                                            <thead className="text-capitalize">
                                                                <tr role="row">
                                                                    <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">Sr.No.</th>
                                                                    <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Username</th>
                                                                    <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {renderedTableRows}
                                                            </tbody>
                                                        </table>
                                                        {/* <div style={{ alignItems: 'center' }} className="pagination-container"> */}
                                                        {/* <TablePagination
                                                                sx={{ alignItems: 'center', color: 'purple' }}
                                                                rowsPerPageOptions={[5, 10, 25]}
                                                                component="div"
                                                                count={noOfPage}
                                                                rowsPerPage={rowsPerPage}
                                                                page={page}
                                                                onPageChange={handleChangePage}
                                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                            /> */}
                                                        <div className='mt-4'>
                                                            <ReactPaginate
                                                                previousLabel={"Previous"}
                                                                nextLabel={"Next"}
                                                                breakLabel={"..."}
                                                                pageCount={noOfPage}
                                                                marginPagesDisplayed={2}
                                                                pageRangeDisplayed={3}
                                                                onPageChange={handleChangePage}
                                                                containerClassName={"pagination justify-content-center"}
                                                                pageClassName={"page-item"}
                                                                pageLinkClassName={"page-link"}
                                                                previousClassName={"page-item"}
                                                                previousLinkClassName={"page-link"}
                                                                nextClassName={"page-item"}
                                                                nextLinkClassName={"page-link"}
                                                                breakClassName={"page-item"}
                                                                breakLinkClassName={"page-link"}
                                                                activeClassName={"active"}
                                                            />
                                                        </div>
                                                        {/* </div> */}
                                                    </div>
                                                    <br /><br />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
