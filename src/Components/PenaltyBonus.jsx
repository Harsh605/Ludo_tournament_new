import React, { useRef, useState, useEffect } from 'react'
import * as FileSaver from 'file-saver';
import axios from 'axios';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf"
import { TablePagination } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { baseURL } from '../token';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { handleUnAuthorized } from './hooks/handleUnAuthorized';

function PenaltyBonus() {
    const navigate = useNavigate()
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [filteredData, setFilteredData] = useState(false);
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
                _stype: searchType
            }
            const response = await axios.get(`${baseURL}User/all/panelty`, {
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

    useEffect(() => {
        fetchAdmindata();
    }, [page, rowsPerPage, startDate, endDate, searchType, searchList])

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setSelectedStatus('')
        settabledata(tabledata);
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

    const [type, setType] = useState("")
    const [wallet, setWallet] = useState('')
    const [bonus, setBonus] = useState("")
    const update = (id) => {
        if (type === "") {
            alert("Plz select Type")
            return
        }
        if (bonus === "" || +bonus < 0) {
            alert("Fill amount")
            return
        }
        if (!wallet) {
            alert("Please select Wallet Type.")
            return
        }
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        if (type === "bonus") {
            const confirm = window.confirm("Are you sure, you want to add bonus to this user?")
            if (confirm) {
                axios.post(baseURL + `user/bonus/${id}?wallet=${wallet}`,
                    {
                        bonus: JSON.parse(bonus)
                    },
                    { headers })
                    .then((res) => {
                        Swal.fire({
                            icon: "success",
                            title: "Successfully",
                            text: "Bonus add successfully",
                        });
                        setBonus("")
                        setType("")
                        fetchAdmindata()
                    })
            }
        } else {
            const confirm2 = window.confirm("Are you sure, you want to add penalty to this user?")
            if (confirm2) {
                axios.post(baseURL + `user/penlaty/${id}?wallet=${wallet}`,
                    {
                        bonus: JSON.parse(bonus)
                    },
                    { headers })
                    .then((res) => {
                        if(res.data.status === 0) {
                            Swal.fire({
                                icon: "error",
                                title: "Penalty",
                                text: "Insufficient fund",
                            });
                            return
                        }
                        Swal.fire({
                            icon: "success",
                            title: "Successfully",
                            text: "Penalty add successfully",
                        });
                        setBonus("")
                        setType("")
                        fetchAdmindata()
                    })
            }
        }
    }

    const renderedTableRows = tabledata.map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();

        return (
            <tr role="row" key={index}>
                <td>{index + 1 + (page - 1) * rowsPerPage}</td>
                <td>{data._id}</td>
              
                <td>  <button
                    className="btn btn-danger ml-1"
                    disabled={isloading}
                    onClick={() => navigate(`/view/${data?._id}`, { state: { id: data?._id } })} // Pass the user ID to the function
                >
                    {data?.Name?.slice(0, 6)}
                </button></td>
                <td>{data?.Phone}</td>
                <td>{data?.Wallet_balance}</td>
                {/* <td>{data?.DOB}</td> */}
                <td>
                    <div className="row">
                        <div className="col-12 col-lg-3">
                            <input id="number" type="number" className="form-control input-sm" style={{ minWidth: '100px' }}
                                placeholder="Amount" onChange={(e) => setBonus(e.target.value)} />
                        </div>
                        <div className="col-12 col-lg-3">
                            <div className="form-group">
                                <select className="form-control input-sm" name="type" style={{ minWidth: '100px' }} onChange={(e) => setType(e.target.value)}>
                                    <option value="" disabled selected>Select</option>
                                    <option value="penalty">Penalty</option>
                                    <option value="bonus">Bonus</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <div className="form-group">
                                <select className="form-control input-sm" name="type" style={{ minWidth: '100px' }} onChange={(e) => setWallet(e.target.value)}>
                                    <option value="" disabled selected>Select</option>
                                    <option value="mainWallet">Game Wallet</option>
                                    <option value="wonWallet">Won Wallet</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-lg-2">
                            <button className="btn btn-sm btn-primary" onClick={() => update(data?._id)}>UPDATE</button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    });

    const handleSearch = (e) => {
        e.preventDefault();
        // setFilteredData(!filteredData)
    };

    return (
        <> <div className='fade-in'>
            <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                <h3 style={{ color: 'white' }}>Penalty&Bonus</h3>
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
                                            <select className='form-control col-sm-3 m-2' id='searchType' name='searchtype' onChange={(e) => setSearchType(e.target.value)} style={{ backgroundColor: "whitesmoke" }}>
                                                <option value="0">Select Search by</option>
                                                <option value="Name" selected={searchType === "Name"}>Name</option>
                                                <option value="Phone" selected={searchType === "Phone"}>Phone</option>
                                                <option value="_id" selected={searchType === "_id"}>User Id</option>
                                            </select>
                                            <input type='text' placeholder='Search...' className='form-control col-sm-4 m-2' onChange={searchHandler} style={{ backgroundColor: "whitesmoke" }} />
                                            <select className='form-control col-sm-1 m-2' id='pagelimit' name='pagelimit' onChange={(e) => setRowsPerPage(+e.target.value)} style={{ backgroundColor: "whitesmoke" }}>
                                                <option value="10">Set limit</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="500">500</option>
                                            </select>
                                        </div>
                                        {/* <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <label htmlFor="validationCustomUsername">Type</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Type" defaultValue name="type_id" />
                                                </div>
                                            </div> */}

                                        <div className='row' />
                                        <br />
                                        {/* <div className="col-12">
                                            <center>
                                                <button className="btn btn-primary" onClick={(e) => handleSearch(e)} >Search Now</button>
                                                <button className="button-reset btn btn-info" style={{ marginLeft: '20px' }} type="button" onClick={handleReset}>Reset <span><RotateLeftIcon /></span> </button>

                                            </center>
                                        </div>
                                        <br /> */}
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
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">ID</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Name</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Mobile </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Balance</th>
                                                            <span><th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 65 }} aria-label="Time: activate to sort column ascending">Action </th></span>
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
                                            {/* <div className="pagination-container">
                                                <TablePagination sx={{ color: 'purple' }}
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    // pageCount={10}
                                                    count={noOfPage}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                />
                                            </div> */}
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

export default PenaltyBonus;
