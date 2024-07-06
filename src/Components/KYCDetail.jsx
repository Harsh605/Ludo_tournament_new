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

function KYCDetail() {
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

    const fetchAdmindata = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
            const params = {
                page: page,
                _limit: rowsPerPage,
                startDate: startDate,
                endDate: endDate,
                _q: searchQuery?.trim(),
                _status: selectedStatus,
                _stype: 'Name'
            }

            const response = await axios.get(`${baseURL}aadharcard/all/all/all/all`, {
                params: params, headers: headers,
            });

            if (response.status === 200) {

                // // Fetch data for each user and create an array of promises
                // const userPromises = users.map(async (user) => {
                //     const userResponse = await axios.get(`${baseURL}/challenge/played/${user.id}`, {
                //         headers: headers,
                //     });

                //     // Append the additional data to the user object
                //     console.log(userResponse?.data?.data?.rows);
                //     user.gamesPlayed = userResponse?.data?.data?.rows;
                //     // return user;
                // });
                setNoOfPage(response?.data?.totalPages)
                settabledata(response?.data?.admin);
                imageViewer()
                // Wait for all promises to resolve
                // const userDataWithGames = await Promise.all(userPromises);
                // settabledata(userDataWithGames);
            }
        } catch (error) {
            console.log(error);
            handleUnAuthorized(error.response.data, navigate)
        }
    };

    function imageViewer() {
        let imgs = document.getElementsByClassName("img"),
            out = document.getElementsByClassName("img-out")[0];
            console.log("111");
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

                    console.log("imgElement0", imgElement, imgWrapper, out)
                    out.appendChild(imgWrapper);
                    imgClose.addEventListener("click", function () {
                        container.classList.remove("img-panel__selct");
                        out.removeChild(imgWrapper);
                    });
                }
            }
        }
    }

    useEffect(() => {
        fetchAdmindata();
    }, [page, rowsPerPage, startDate, endDate, searchQuery, selectedStatus])

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setSelectedStatus('')
        setFilteredData(false)
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

    const update = (Id) => {

        const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.patch(baseURL + `aadharcard/${Id}`,
            { verified: "verified" },
            { headers })
            .then((res) => {
                Swal.fire({
                    icon: "success",
                    title: "Successfully",
                    text: "Kyc approve successfully",
                });
                fetchAdmindata()
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
                Swal.fire({
                    icon: "success",
                    title: "Successfully",
                    text: "Kyc reject successfully",
                });
                fetchAdmindata()
            })

    }


    const renderedTableRows = tabledata.map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();

        return (
            <tr role="row" key={index}>
                <td>{index + 1 + (page - 1) * rowsPerPage}</td>
                {/* <td><Link type='button' className="btn btn-primary mx-1" to={`/user/view_user/${(data?.User) ? data?.User?._id : ''}`}>{(data?.User) ? data?.User?.Name?.slice(0, 8) : ''}</Link></td> */}
                <td><button
                    className="btn btn-danger ml-1"
                    disabled={isloading}
                    // onClick={() => navigate(`/view/${(data?.User) ? data?.User?._id : ''}`, { state: { id: data?.User ? data?.User?._id : '' } })} // Pass the user ID to the function
                    onClick={() => navigate(`/view`, { state: { id: data?.User ? data?.User?._id : '' } })} // Pass the user ID to the function
                >
                    {(data?.User) ? data?.User?.Name?.slice(0, 6) : ''}
                </button></td>
                <td>{data?.Name?.slice(0, 6)}</td>
                <td>{data?.User?.Phone}</td>
                <td>{data?.Number?.toString()?.slice(0, 12)}</td>
                <td>{data?.DOB}</td>
                <td>
                    <div className="img-panel">
                        <img className="img" src={baseURL + `${data?.front}`} alt="kyc" style={{
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
                        <img className="img" src={baseURL + `${data?.back}`} alt="kyc" style={{
                            borderRadius: '5px',
                            width: '4rem',
                            height: '4rem',
                        }}
                            id={`kyc${index}`}
                        />
                    </div>
                </td>
                <td>
                <div className="badge badge-outline-success" style={{ width: "80px", height: '2rem', display: 'flex', alignItems: 'center', justifyContent: "center" , color: 'white', backgroundColor: data?.verified === 'pending' ? 'blue' : data?.verified === 'reject' ? 'red' : data?.verified === 'verified' ? 'green' : null }}>{data?.verified === 'pending' ? 'Pending' : data?.verified === 'reject' ? 'Reject' : data?.verified === 'verified' ? 'Verified' : ''}</div>
                </td>
                <td>{formattedDate}</td>
                <td>{formattedTime}</td>
                <td>
                    {data?.verified === 'pending' && <div className="col-md-3">
                        <div className="row" style={{ width: '10pc' }}>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <button className="btn btn-success mr-1" onClick={() => update(data?._id)}>Approve</button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <button className="btn btn-danger ml-3" onClick={() => deletedata(data?._id)}>Reject</button>
                                </div>
                            </div>
                        </div>
                    </div>}
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
                <h3 style={{ color: 'white' }}>KYC Detail</h3>
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


                                        <div style={{ clear: 'both' }} />
                                        <div className='row pl-3'>
                                            <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <div className="form-group">
                                                    <label htmlFor="validationCustomUsername"> User Name</label>
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="search by doc name"
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
                                                        <option value="">All</option>
                                                        <option value="verified">Verified</option>
                                                        <option value="reject">Reject</option>
                                                        <option value="pending">Pending</option>
                                                        {/* <option value="unverified">Unverified</option> */}
                                                    </select>
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
                                        {/* <div className="col-12">
                                            <center>
                                                <button className="btn btn-primary" onClick={(e) => handleSearch(e)} >Search Now</button>
                                                <button className="button-reset btn btn-info" style={{ marginLeft: '20px' }} type="button" onClick={handleReset}>Reset <span><RotateLeftIcon /></span> </button>

                                            </center>
                                        </div> */}
                                        {/* <br /> */}
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
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 90 }} aria-label="From: activate to sort column ascending">Profile name</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 90 }} aria-label="From: activate to sort column ascending">Doc name</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Mobile </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Aadhar no</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">DOB</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Document-Front</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Document-Back</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Status</th>
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

export default KYCDetail;
