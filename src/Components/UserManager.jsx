import React, { useRef, useState, useEffect } from 'react'
import * as FileSaver from 'file-saver';
import axios from 'axios';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf"
import { TablePagination } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { baseURL } from '../token';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { handleUnAuthorized } from './hooks/handleUnAuthorized';

function UserManager() {
    const navigate = useNavigate()
    const [filtered, setFiltered] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tabledata, settabledata] = useState([]);
    const [iconRotation, setIconRotation] = useState(0);
    const [noOfPage, setNoOfPage] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isloading, setIsloading] = useState("");
    const [searchList, setSearchList] = useState('');
    const [searchType, setSearchType] = useState('Phone');
    const [findByStatus, setFindByStatus] = useState(0);
    const [findByuserStatus, setFindByuserStatus] = useState("");


    const fetchAdmindata = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            const params = {
                page: page,
                _limit: rowsPerPage,
                startDate: startDate,
                endDate: endDate,
                _q: searchList,
                _status: findByStatus,
                _stype: searchType,
                _Userstatus: findByuserStatus
            }

            const response = await axios.get(`${baseURL}User/all`, {
                params: params, headers: headers,
            });

            if (response.status === 200) {
                setNoOfPage(response?.data?.totalPages)
                settabledata(response?.data?.admin);
            }
        } catch (error) {
            console.log(error);
            handleUnAuthorized(error.response.data, navigate)
        }
    };

    const searchHandler = (event) => {
        let key = event.target.value
        setSearchList(key);
    }

    //   search by status handler
    const searchByStatus = (event) => {
        let key = event.target.value
        setFindByStatus(key);
        setFindByuserStatus(key);
    }

    useEffect(() => {
        fetchAdmindata();
    }, [page, rowsPerPage, startDate, endDate, findByuserStatus, searchType, findByStatus, searchList])

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setSearchList('');
        setSelectedStatus('')
        setSearchType('Phone')
        // setFiltered(false)
        // settabledata(tabledata);
        // setIconRotation(iconRotation + 360); // Rotate the icon by 360 degrees
        fetchAdmindata()
    };

    const handleChangePage = (data) => {
        setPage(data.selected + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate the index range for the current page
    // const startIndex = page * rowsPerPage;
    // const endIndex = startIndex + rowsPerPage;

    // pagination part 
    const handleBlockUser = async (player) => {
        try {
            const confirmBox = window.confirm(`are you sure block ${player.Name}`);
            if (confirmBox === true) {
                const accessToken = localStorage.getItem('access_token');
                const headers = {
                    Authorization: `Bearer ${accessToken}`
                }
                const userType = player.user_type == 'Block' ? 'User' : 'Block';
                axios.post(baseURL + `block/user/${player._id}`, { user_type: userType }, { headers })
                    .then((res) => {
                        Swal.fire({
                            icon: "success",
                            title: "Successfully",
                            text: `${userType === 'User' ? 'Unblock' : 'Block'} Successfully`,
                        });
                        fetchAdmindata()
                    })
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            setIsloading(false);
            // alert('An error occurred while blocking the user');
        }
    };
    // const filteredData = tabledata.filter(data => {
    //     if (!startDate || !endDate) {
    //         return true;
    //     }
    //     const dataDate = new Date(data.date);
    //     const start = new Date(startDate);
    //     const end = new Date(endDate);
    //     return dataDate >= start && dataDate <= end;
    // });

    const renderedTableRows = tabledata.map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();

        return (
            <tr role="row" key={index}>
                <td>{index + 1 + (page - 1) * rowsPerPage}</td>
                <td>{data?._id}</td>
                <td><button
                    className="btn btn-danger ml-1"
                    disabled={isloading}
                    // onClick={() => navigate(`/view/${data?._id}`, { state: { id: data?._id } })} // Pass the user ID to the function
                    onClick={() => navigate(`/view`, { state: { id: data?._id } })} // Pass the user ID to the function
                >
                    {data?.Name?.slice(0, 8)}
                </button></td>
                <td><a className="cxy flex-column" href={`https://api.whatsapp.com/send?phone=+91${data?.Phone}&text=Hello`}>
                    {data?.Phone}
                </a></td>
                <td>{data?.Wallet_balance}</td>
                {console.log('data?.Wallet_balance :>> ', data?.Wallet_balance, ((data?.wonAmount + data?.totalDeposit + data?.referral_earning + data?.totalBonus) - (data?.loseAmount + data?.totalWithdrawl + data?.referral_wallet + data?.withdraw_holdbalance + data?.hold_balance + data?.totalPenalty)))}
                <td className={`${((data?.Wallet_balance - ((data?.wonAmount + data?.totalDeposit + data?.referral_earning + data?.totalBonus) - (data?.loseAmount + data?.totalWithdrawl + data?.referral_wallet + data?.withdraw_holdbalance + data?.hold_balance + data?.totalPenalty)).toFixed(0)) != 0) ? 'text-danger' : 'text-white'}`}>₹ {(data?.Wallet_balance - ((data?.wonAmount + data?.totalDeposit + data?.referral_earning + data?.totalBonus) - (data?.loseAmount + data?.totalWithdrawl + data.referral_wallet + data?.withdraw_holdbalance + data?.hold_balance + data?.totalPenalty))).toFixed(0)}</td>
                <td>{data?.hold_balance}</td>

                <td>{data?.referral}</td>
                <td>{data?.referral_code}</td>
                {/* <td className={`${(data?.wonAmount - data?.loseAmount != 0) ? 'text-danger' : 'text-white'}`}>₹ {data?.wonAmount - data?.loseAmount}</td> */}
                <td>{data?.referralLength}</td>
                <td>{data?.totalDeposit}</td>
                <td>{data?.totalWithdrawl}</td>
                <td>{data?.wonAmount}</td>
                <td>{data?.referral_earning}</td>
                <td>{data?.totalBonus}</td>
                <td>{data?.totalPenalty}</td>
                {/* <td>{data?.Referred_By?.Name}</td> */}
                <td>
                    <div className="badge badge-outline-success" style={{ width: "80px",height: '2rem', display: 'flex', alignItems: 'center', justifyContent: "center" , color: 'white', backgroundColor: data?.verified === 'pending' ? 'blue' : data?.verified === 'unverified' ? 'red' : data?.verified === 'verified' ? 'green' : null }}>{data?.verified === 'pending' ? 'Pending' : data?.verified === 'unverified' ? 'Not Requested' : data?.verified === 'verified' ? 'Approve' : ''}</div>
                </td>
                <td>{formattedDate}</td>
                <td>{formattedTime}</td>
                <td>
                    {/* {isloading && <p>Loading...</p>} */}
                    <div style={{ width: '20pc' }}>
                        {data?.user_type === "Block" ? (
                            <button
                                className="btn btn-danger"
                                disabled={isloading}
                                onClick={() => handleBlockUser(data)} // Pass the user ID to the function
                            >
                                Unblock
                            </button>)
                            :
                            (<button
                                className="btn btn-danger"
                                disabled={isloading}
                                onClick={() => handleBlockUser(data)} // Pass the user ID to the function
                            >
                                Block
                            </button>)
                        }
                        {/* <button
                            className="btn btn-success ml-1"
                            disabled={isloading}
                        // onClick={() => handleBlockUser(data?.id, false)} // Pass the user ID to the function
                        >
                            Edit User
                        </button> */}
                        <button
                            className="btn btn-danger ml-1"
                            disabled={isloading}
                            // onClick={() => navigate(`/view/${data?._id}`, { state: { id: data?._id } })} // Pass the user ID to the function
                            onClick={() => navigate(`/view`, { state: { id: data?._id } })} // Pass the user ID to the function
                        >
                            View
                        </button>
                        <button
                            className="btn btn-danger ml-1"
                            disabled={isloading}
                            onClick={() => navigate(`/user/changePassword/${data?._id}`, { state: { id: data?._id } })} // Pass the user ID to the function
                        >
                            Change Password
                        </button>
                    </div>

                </td>
            </tr>
        );
    });

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     setFiltered(!filtered)
    // };

    return (
        <> <div className='fade-in'>
            <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                <h3 style={{ color: 'white' }}>User Manager</h3>
            </div>
            <section style={{ marginTop: '2rem' }} className="content">
                <div className="container-fluid" style={{ marginTop: '-35px' }}>
                    <div className="row">
                        {/* Primary table start */}
                        <div className="col-12 mt-5">
                            <div className="card">
                                <div style={{ background: '#a6a6ff' }} className="card-body">
                                    {/* <form >
                                        <input type="hidden" name="_token" defaultValue="ufIIKQky4pOtOxFVX1zXKHf58iF6SEHdlPsJf3tm" />
                                        <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                            <div className="form-group">
                                                <label>Pick a start date:</label>
                                                <div className="input-group date" id="datepicker" data-target-input="nearest">
                                                    <input type="date"
                                                        className="form-control t"
                                                        placeholder="yyyy-mm-dd"
                                                        name="start_date"
                                                        value={startDate}
                                                        onChange={handleStartDateChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                            <div className="form-group">
                                                <label>Pick a end date:</label>
                                                <div className="input-group date" id="datepicker1" data-target-input="nearest">
                                                    <input type="date"
                                                        className="form-control"
                                                        placeholder="yyyy-mm-dd"
                                                        name="end_date"
                                                        value={endDate}
                                                        onChange={handleEndDateChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ clear: 'both' }} />
                                        <div className='row'>
                                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <label htmlFor="validationCustomUsername">Search </label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" id="validationCustomUsername" defaultValue placeholder="Name,Username,number" aria-describedby="inputGroupPrepend" name="user" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <div id="table_id_filter" className="dataTables_filter">
                                                    <label>
                                                        Filter by Status:

                                                    </label>
                                                    <select
                                                        style={{ height: "37px" }}
                                                        className="form-control form-control-sm "
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="approved">Approved</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ clear: 'both' }} />
                                        <div style={{ clear: 'both' }} />
                                        <br />
                                        <div className="col-md-12 mb-12">
                                            <center>
                                                <button className="btn btn-primary" type='button'>Search Now</button>
                                                <button className='btn btn-success' type='button' style={{ marginLeft: 20, textAlign: 'center' }} onClick={handleReset}>Reset</button>
                                            </center>
                                        </div>
                                        <br />
                                    </form> */}
                                    <form role="form" type="submit">
                                        {/* <input type="hidden" name="_token" defaultValue="eLkpGsUBYr9izTDYhoNZCCY6pxm06c8hRkw1N41O" /> */}
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

                                        <div className='row pl-3'>
                                            <select className='form-control col-sm-3 m-2' style={{ backgroundColor: "whitesmoke" }} id='searchType' name='searchtype' onChange={(e) => setSearchType(e.target.value)}>
                                                <option value="0">Select Search by</option>
                                                <option value="Name" selected={['Name'].includes(searchType)}>Name</option>
                                                <option value="Phone" selected={['Phone'].includes(searchType)}>Phone</option>
                                                <option value="_id" selected={['_id'].includes(searchType)}>User Id</option>
                                            </select>
                                            <input type='text' style={{ backgroundColor: "whitesmoke" }} value={searchList} placeholder='Search...' className='form-control col-sm-4 m-2' onChange={searchHandler} />

                                            <h5 style={{ color: "black", paddingTop: "15px" }}>Or</h5>
                                            <select className='form-control col-sm-2 m-2' id='findByStatus' name='findByStatus' onChange={searchByStatus} style={{ backgroundColor: "whitesmoke" }}>
                                                <option value="0" disabled selected>Search Status</option>
                                                <option value="">All</option>
                                                <option value="verified">approve</option>
                                                <option value="unverified">not requested</option>
                                                <option value="pending">pending</option>
                                            </select>

                                            <select className='form-control col-sm-1 m-2' id='pagelimit' name='pagelimit' onChange={(e) => setRowsPerPage(+e.target.value)} style={{ backgroundColor: "whitesmoke" }}>
                                                <option value="10">Set limit</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="500">500</option>
                                            </select>
                                        <button className="button-reset btn btn-info" style={{ marginLeft: '20px', height: '2.3rem', marginTop: '5px' }} type="button" onClick={handleReset}>Reset <span><RotateLeftIcon /></span> </button>
                                        </div>
                                        {/* <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <label htmlFor="validationCustomUsername">Type</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Type" defaultValue name="type_id" />
                                                </div>
                                            </div> */}

                                        <div className='row' />
                                        <br />
                                        
                                        <br />
                                    </form>
                                    <div className="single-table">
                                        <div className="table-responsive">
                                            {/* fund history */}
                                            <div id="table_id_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">


                                                <table className="table text-center dataTable no-footer dtr-inline" id="table_id" role="grid" aria-describedby="table_id_info" style={{}}>
                                                    <thead className="text-capitalize">

                                                        {/* <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">SR. NO.</th> */}
                                                        <tr role="row">
                                                            <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">Sr.no</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">ID </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Name </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Mobile </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Balance</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">MisMatch</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Game hold</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Reference By</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Referral Code</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">No. of Referral</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Total deposit</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Total Withdraw</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Game Earning</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Referral Earning</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Bonus</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Penalty</th>
                                                            {/* <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Total Earning/Loss</th> */}
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">KYC Status</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 129 }} aria-label="Date: activate to sort column ascending">Date</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Time </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 10 }} aria-label="Time: activate to sort column ascending">Action </th>
                                                        </tr>

                                                    </thead>
                                                    <tbody>
                                                        {renderedTableRows}
                                                    </tbody>
                                                </table>

                                            </div>
                                            <br /><br />
                                            <center>
                                                <div>
                                                </div>
                                            </center>
                                            {/* <div className="pagination-container"> */}
                                            {/* <TablePagination sx={{ color: 'purple' }}
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    // pageCount={10}
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
                                            {/* fund history */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Primary table end */}

                    </div>
                </div>
            </section>
        </div>

        </>
    )
}

export default UserManager;