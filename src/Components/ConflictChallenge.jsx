import React, { useRef, useState, useEffect } from 'react'
import * as FileSaver from 'file-saver';
import axios from 'axios';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf"
import { TablePagination } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { baseURL } from '../token';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { handleUnAuthorized } from './hooks/handleUnAuthorized'

function DropChallenge() {
    const navigate = useNavigate()
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [filtered, setFiltered] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [creatorname, setCreatorname] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tabledata, settabledata] = useState([]);
    const [iconRotation, setIconRotation] = useState(0);
    const [noOfPage, setNoOfPage] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [acceptorname, setAcceptorname] = useState("");

    const fetchAdmindata = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            const params = {
                page: page,
                _limit: rowsPerPage,
                startDate: startDate,
                endDate: endDate,
                first_query: creatorname ? 'Created_by' : 'Accepetd_By',
                keyword: creatorname || acceptorname,
                _status: selectedStatus,
                _stype: 'Name'
            }
            const response = await axios.get(`${baseURL}challange/conflict_challange`, {
                params: params, headers: headers,
            });

            if (response.status === 200) {
                setNoOfPage(response.data.totalPages)
                settabledata(response.data.status);
            }
        } catch (error) {
            console.log(error);
            handleUnAuthorized(error.response.data, navigate)
        }
    };

    useEffect(() => {
        fetchAdmindata();
    }, [page, filtered])

    const handleStatusFilterChange = (event) => {
        // setStatusFilter(event.target.value);
        setSelectedStatus(event.target.value);
    };

    const handleReset = () => {
        setRowsPerPage(10);
        setStartDate('');
        setEndDate('');
        setCreatorname('');
        setAcceptorname('');
        setSelectedStatus('')
        settabledata(tabledata);
        setFiltered(!filtered);
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

    const renderedTableRows = tabledata.map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();

        return (
            <tr role="row" key={index}>
                <td>{index + 1 + (page - 1) * rowsPerPage}</td>
                <td>{data?.Created_by ? data?.Created_by?.Name : null}</td>
                <td>{data?.Accepetd_By ? data?.Accepetd_By?.Name : null}</td>
                <td>{data?.Room_code}</td>
                <td>{data?.Game_Ammount}</td>
                <td>{data?.Status}</td>
                <td>{data?.Game_type}</td>
                {/* <td>{data?.Winner ? data?.Winner?.Name : null}</td> */}
                <td>{formattedDate}</td>
                <td>{formattedTime}</td>
                <td>
                    <button
                        className="btn btn-danger ml-1"
                        // disabled={isloading}
                        // onClick={() => navigate(`/game-view/${data?._id}`, { state: { id: data?._id } })} // Pass the user ID to the function
                        onClick={() => navigate(`/game-view`, { state: { id: data?._id } })} // Pass the user ID to the function
                    >
                        View
                    </button>
                    {/* {game.Status != "cancelled" && game.Status != "completed" && game.Status != "conflict" && <button type='button' className="btn  mx-1 btn-danger" onClick={() => CancelGame(game._id)}>Cancel</button>} */}
                </td>
            </tr>
        );
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setFiltered(!filtered)
    };

    return (
        <> <div className='fade-in'>
            <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                <h3 style={{ color: 'white' }}>Conflict Challenge</h3>
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
                                            {/* </div> */}
                                        </div>


                                        <div style={{ clear: 'both' }} />
                                        <div className='row'>
                                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <div className="form-group">
                                                    <label>Creator name:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Username"
                                                        name="userid"
                                                        value={creatorname}
                                                        onChange={(e) => setCreatorname(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <div className="form-group">
                                                    <label>Acceptor name:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Username"
                                                        name="userid"
                                                        value={acceptorname}
                                                        onChange={(e) => setAcceptorname(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row pl-3'>
                                            <select className='form-control col-sm-1 mt-2' id='pagelimit' name='pagelimit' onChange={(e) => setRowsPerPage(+e.target.value)} style={{ backgroundColor: "whitesmoke" }}>
                                                <option value="10">Set limit</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="500">500</option>
                                            </select>
                                        </div>

                                        <br />
                                        <div className="col-12">
                                            <center>
                                                <button className="btn btn-primary" onClick={(e) => handleSearch(e)} >Search Now</button>
                                                <button className="button-reset btn btn-info" style={{ marginLeft: '20px' }} type="button" onClick={handleReset}>Reset <span><RotateLeftIcon /></span> </button>
                                            </center>
                                        </div>
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
                                                            <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">Sr.No.</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Creator </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Accepter </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Room Code </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Amount</th>
                                                            {/* <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Winner_Name</th> */}
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Status</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Game Type </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 129 }} aria-label="Date: activate to sort column ascending">Date</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Time </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Action </th>
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

export default DropChallenge;
