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
import { handleUnAuthorized } from './hooks/handleUnAuthorized'

function DepositManager() {
    const navigate = useNavigate()
    const [blockedUsers, setBlockedUsers] = useState([]);
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

    const fetchAdmindata = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            const params = {
                page: page,
                _limit: rowsPerPage,
                startDate: startDate,
                endDate: endDate,
                _q: searchQuery,
                _status: selectedStatus,
                _stype: 'Name'
            }

            const response = await axios.get(`${baseURL}temp/deposite`, {
                params: params, headers: headers,
            });

            if (response.status === 200) {
                setNoOfPage(response?.data?.totalPages)
                settabledata(response?.data?.data);
                setTimeout(() => imageViewer(), 700)

            }
        } catch (error) {
            console.log(error);
            handleUnAuthorized(error.response.data, navigate)
        }
    };

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

    const withdrowPass = (id) => {
        const confirm = window.confirm("Are you sure, you want to update to success this payout?")
        if (confirm) {
            const access_token = localStorage.getItem("access_token")
            const headers = {
                Authorization: `Bearer ${access_token}`
            }

            axios.post(baseURL + `userwithdrawupdate/${id}`,
                {
                    status: "SUCCESS"
                },
                { headers })
                .then((res) => {
                    Swal.fire({
                        icon: "success",
                        title: "Successfully",
                        text: `Payout done successfully`,
                    });
                    fetchAdmindata();
                }).catch((e) => {
                    //console.log(e);
                })
        }
    }


    const withdrowFail = (id) => {
        const confirm = window.confirm("Are you sure, you want to update to failed this payout?")
        if (confirm) {
            const access_token = localStorage.getItem("access_token")
            const headers = {
                Authorization: `Bearer ${access_token}`
            }

            axios.post(baseURL + `userwithdrawupdate/${id}`,
                {
                    status: "FAILED"
                },
                { headers })
                .then((res) => {
                    Swal.fire({
                        icon: "success",
                        title: "Successfully",
                        text: `Payout reject successfully`,
                    });
                    fetchAdmindata();
                    //console.log(res);
                }).catch((e) => {
                    //console.log(e);
                })
        }
    }

    useEffect(() => {
        fetchAdmindata();
    }, [page, rowsPerPage, filtered, selectedStatus])

    console.log('selectedStatus :>> ', selectedStatus);

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setSelectedStatus('')
        setFiltered(false)
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

    const update = async (id) => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.patch(baseURL + `temp/deposite/${id}`,
            {
                status: "success"
            },
            { headers })
            .then((res) => {
                fetchAdmindata()
            }).catch((e) => {
                console.log(e);
            })
    }

    const cancelledData = async (id) => {
        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.delete(baseURL + `temp/deposit/delete/${id}`,

            { headers })
            .then((res) => {
                fetchAdmindata()

            }).catch((e) => {
                console.log(e);
            })
    }

    const renderedTableRows = tabledata.map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();

        return (
            <tr role="row" key={index}>
                <td>{index + 1 + (page - 1) * rowsPerPage}</td>
                <td>{data?._id}</td>
                <td>{data?.user && <button
                    className="btn btn-danger ml-1"
                    disabled={isloading}
                    // onClick={() => navigate(`/view/${data?.user?._id}`, { state: { id: data?.user?._id } })} // Pass the user ID to the function
                    onClick={() => navigate(`/view`, { state: { id: data?.user?._id } })} // Pass the user ID to the function
                >
                    {data?.user?.Name.slice(0, 6)}
                </button>}</td>
                <td>{data?.user && data?.user?.Phone}</td>
                <td>{data?.amount}</td>
                {/* <td>{data?.type}</td> */}
                <td><div className="img-panel">

                    <img className="img" src={baseURL + `${data?.Transaction_Screenshot}`} style={{
                        borderRadius: '5px',
                        width: '4rem',
                        height: '4rem',
                    }}
                        id={`ss${index}`}
                    />
                </div></td>

                <td><span style={{ backgroundColor: data?.status === 'success' ? 'green' : 'red', color: 'white', padding: '4px' }}>{data?.status}</span></td>
                <td>{formattedDate}</td>
                <td>{formattedTime}</td>
                <td>
                    <div style={{ width: '10pc' }}>
                        {data?.status == "pending" && <button className="btn btn-primary mr-2" style={{ backgroundColor: 'green!important' }} onClick={() => update(data?._id)} >Approve</button>}

                        {/* {data?.status == "success" && <button className="btn btn-success mr-2" style={{ backgroundColor: 'green' }} >success</button>} */}
                        {data?.status == "pending" && <button className="btn btn-danger mr-2" style={{ backgroundColor: 'red' }} onClick={() => cancelledData(data?._id)} >Reject</button>}
                    </div>

                </td>
            </tr>
        );
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setFiltered(!filtered)
    };

    return (
        <> 
        
        <div className='fade-in'>
            <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                <h3 style={{ color: 'white' }}>Deposit Manager</h3>
            </div>
            <section style={{ marginTop: '2rem' }} className="content">
                <div className="container-fluid" style={{ marginTop: '-35px' }}>
                    <div className="img-out"></div>
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
                                        {/* <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
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


                                        <div style={{ clear: 'both' }} />
                                        <div className='row'>
                                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <div className="form-group">
                                                    <label htmlFor="validationCustomUsername"> User Name</label>
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Username"
                                                            name="userid"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <div className="form-group">
                                                    <label htmlFor="validationCustomUsername">Select id status</label>
                                                    <select className="form-control" name="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                                        <option value="all">All</option>
                                                        <option value="Block">Blocked</option>
                                                        <option value="Unblock">UnBlocked</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className='row pl-3'>
                                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <div className="form-group">
                                                    {/* <label htmlFor="validationCustomUsername">Select id status</label> */}
                                                    <select className="form-control" name="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                                        <option value="all" disabled selected>Status</option>
                                                        <option value="">All</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="success">Approve</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <select className='form-control col-sm-1' id='pagelimit' name='pagelimit' onChange={(e) => setRowsPerPage(+e.target.value)} style={{ marginTop: 10, backgroundColor: "whitesmoke" }}>
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

                                        {/* <div className='row' />
                                        <br />
                                        <div className="col-12">
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
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">ID </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Name </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Mobile </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Amount </th>
                                                            {/* <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Withdraw type</th> */}
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Screenshot</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Status </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 129 }} aria-label="Date: activate to sort column ascending">Date</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Time </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Action</th>
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

export default DepositManager;
