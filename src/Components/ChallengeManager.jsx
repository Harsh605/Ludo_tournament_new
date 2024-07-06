// import React, { useRef, useState, useEffect } from 'react'
// import * as FileSaver from 'file-saver';
// import axios from 'axios';
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import jsPDF from "jspdf"
// import { TablePagination } from '@mui/material';
// import RotateLeftIcon from '@mui/icons-material/RotateLeft';
// import { baseURL } from '../token';

// function UserManager() {
//     const [blockedUsers, setBlockedUsers] = useState([]);
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [creatorname, setCreatorname] = useState("");
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [tabledata, settabledata] = useState([]);
//     const [iconRotation, setIconRotation] = useState(0);
//     const [selectedStatus, setSelectedStatus] = useState("");

//     //   const tabledata = [
//     //     {
//     //       number: 1,
//     //       name: 'John Doe',
//     //       mobile: '123-456-7890',
//     //       balance: 5000,
//     //       miss_match: 2,
//     //       game_hold: 'Yes',
//     //       refer_by: 'Jane Smith',
//     //       username: 'john123',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 2,
//     //       name: 'Jane Smith',
//     //       mobile: '987-654-3210',
//     //       balance: 7000,
//     //       miss_match: 1,
//     //       game_hold: 'No',
//     //       refer_by: 'Michael Johnson',
//     //       username: 'jane456',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 3,
//     //       name: 'Michael Johnson',
//     //       mobile: '555-555-5555',
//     //       balance: 3000,
//     //       miss_match: 0,
//     //       game_hold: 'Yes',
//     //       refer_by: 'John Doe',
//     //       username: 'michael789',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 4,
//     //       name: 'Emily Davis',
//     //       mobile: '222-333-4444',
//     //       balance: 10000,
//     //       miss_match: 1,
//     //       game_hold: 'No',
//     //       refer_by: 'Jane Smith',
//     //       username: 'emily222',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 5,
//     //       name: 'David Wilson',
//     //       mobile: '777-888-9999',
//     //       balance: 8000,
//     //       miss_match: 3,
//     //       game_hold: 'Yes',
//     //       refer_by: 'Michael Johnson',
//     //       username: 'david777',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 6,
//     //       name: 'Sarah Brown',
//     //       mobile: '555-444-3333',
//     //       balance: 12000,
//     //       miss_match: 2,
//     //       game_hold: 'No',
//     //       refer_by: 'Jane Smith',
//     //       username: 'sarah555',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 7,
//     //       name: 'William Jones',
//     //       mobile: '111-222-3333',
//     //       balance: 6000,
//     //       miss_match: 1,
//     //       game_hold: 'Yes',
//     //       refer_by: 'John Doe',
//     //       username: 'william111',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 8,
//     //       name: 'Olivia Green',
//     //       mobile: '444-333-2222',
//     //       balance: 9500,
//     //       miss_match: 0,
//     //       game_hold: 'No',
//     //       refer_by: 'Michael Johnson',
//     //       username: 'olivia444',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 9,
//     //       name: 'James Taylor',
//     //       mobile: '666-777-8888',
//     //       balance: 2000,
//     //       miss_match: 3,
//     //       game_hold: 'Yes',
//     //       refer_by: 'Jane Smith',
//     //       username: 'james666',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 10,
//     //       name: 'Sophia Adams',
//     //       mobile: '111-999-8888',
//     //       balance: 11000,
//     //       miss_match: 2,
//     //       game_hold: 'No',
//     //       refer_by: 'John Doe',
//     //       username: 'sophia111',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 11,
//     //       name: 'Ethan Martinez',
//     //       mobile: '555-222-4444',
//     //       balance: 8000,
//     //       miss_match: 1,
//     //       game_hold: 'Yes',
//     //       refer_by: 'Michael Johnson',
//     //       username: 'ethan555',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 12,
//     //       name: 'Ava Hernandez',
//     //       mobile: '777-333-1111',
//     //       balance: 3000,
//     //       miss_match: 0,
//     //       game_hold: 'No',
//     //       refer_by: 'Jane Smith',
//     //       username: 'ava777',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 13,
//     //       name: 'Noah Robinson',
//     //       mobile: '999-888-7777',
//     //       balance: 6000,
//     //       miss_match: 3,
//     //       game_hold: 'Yes',
//     //       refer_by: 'John Doe',
//     //       username: 'noah999',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 14,
//     //       name: 'Mia Ramirez',
//     //       mobile: '333-666-9999',
//     //       balance: 4000,
//     //       miss_match: 2,
//     //       game_hold: 'No',
//     //       refer_by: 'Michael Johnson',
//     //       username: 'mia333',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 15,
//     //       name: 'Liam Anderson',
//     //       mobile: '777-222-4444',
//     //       balance: 8000,
//     //       miss_match: 1,
//     //       game_hold: 'Yes',
//     //       refer_by: 'Jane Smith',
//     //       username: 'liam777',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 16,
//     //       name: 'Isabella Turner',
//     //       mobile: '222-555-9999',
//     //       balance: 9000,
//     //       miss_match: 0,
//     //       game_hold: 'No',
//     //       refer_by: 'John Doe',
//     //       username: 'isabella222',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 17,
//     //       name: 'Benjamin Mitchell',
//     //       mobile: '888-666-4444',
//     //       balance: 5000,
//     //       miss_match: 3,
//     //       game_hold: 'Yes',
//     //       refer_by: 'Michael Johnson',
//     //       username: 'benjamin888',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 18,
//     //       name: 'Grace Lewis',
//     //       mobile: '333-555-9999',
//     //       balance: 7000,
//     //       miss_match: 2,
//     //       game_hold: 'No',
//     //       refer_by: 'Jane Smith',
//     //       username: 'grace333',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 19,
//     //       name: 'Henry Martinez',
//     //       mobile: '666-888-5555',
//     //       balance: 3000,
//     //       miss_match: 1,
//     //       game_hold: 'Yes',
//     //       refer_by: 'John Doe',
//     //       username: 'henry666',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //     {
//     //       number: 20,
//     //       name: 'Luna White',
//     //       mobile: '555-777-9999',
//     //       balance: 9500,
//     //       miss_match: 0,
//     //       game_hold: 'No',
//     //       refer_by: 'Michael Johnson',
//     //       username: 'luna555',
//     //       password: '********',
//     //       action: 'Block'
//     //     },
//     //   ];

//     // pagination part 

//     const fetchAdmindata = async () => {
//         try {
//             const accessToken = localStorage.getItem('access_token');
//             const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

//             const response = await axios.get(`${baseURL}/challenge`, {
//                 headers: headers,
//             });

//             if (response.status === 200) {
//                 const users = response?.data?.data?.rows;

//                 // // Fetch data for each user and create an array of promises
//                 // const userPromises = users.map(async (user) => {
//                 //     const userResponse = await axios.get(`${baseURL}/challenge/played/${user.id}`, {
//                 //         headers: headers,
//                 //     });

//                 //     // Append the additional data to the user object
//                 //     console.log(userResponse?.data?.data?.rows);
//                 //     user.gamesPlayed = userResponse?.data?.data?.rows;
//                 //     // return user;
//                 // });
//                 console.log(users);
//                 settabledata(users);
//                 // Wait for all promises to resolve
//                 // const userDataWithGames = await Promise.all(userPromises);
//                 // settabledata(userDataWithGames);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         fetchAdmindata();
//     }, [])

//     const handleReset = () => {
//         setStartDate('');
//         setEndDate('');
//         setCreatorname('');
//         setSelectedStatus('')
//         settabledata(tabledata);
//         // setIconRotation(iconRotation + 360); // Rotate the icon by 360 degrees
//         fetchAdmindata()
//     };

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

//     const filteredData = tabledata.filter(data => {
//         if (!startDate || !endDate) {
//             return true;
//         }
//         const dataDate = new Date(data.date);
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         return dataDate >= start && dataDate <= end;
//     });

//     const renderedTableRows = filteredData.slice(startIndex, endIndex).map((data, index) => {
//         const createdAt = new Date(data?.createdAt);
//         const formattedDate = createdAt.toLocaleDateString();
//         const formattedTime = createdAt.toLocaleTimeString();

//         return (
//             <tr role="row" key={index}>
//                 <td>{index + 1}</td>
//                 <td>{data?.ChallengerUser?.username}</td>
//                 <td>{data?.AcceptorUser?.username}</td>
//                 <td>{data?.price}</td>
//                 <td>{data?.status}</td>
//                 <td>{data?.category}</td>
//                 <td>{formattedDate}</td>
//                 <td>{formattedTime}</td>
//             </tr>
//         );
//     });

//     const handleSearch = (e) => {
//         e.preventDefault();
//         const filteredData = tabledata?.filter((item) => {
//             const itemDate = new Date(item?.createdAt);
//             const startDateObj = startDate ? new Date(startDate) : null;
//             const endDateObj = endDate ? new Date(endDate) : null;

//             // Check the date range
//             if (startDateObj && endDateObj) {
//                 // Format the item date in the same format as your input (MM/DD/YYYY)
//                 const formattedItemDate = `${itemDate.getMonth() + 1}/${itemDate.getDate()}/${itemDate.getFullYear()}`;
//                 const start = `${startDateObj.getMonth() + 1}/${startDateObj.getDate()}/${startDateObj.getFullYear()}`;
//                 const end = `${endDateObj.getMonth() + 1}/${endDateObj.getDate()}/${endDateObj.getFullYear()}`;
//                 // console.log(start);
//                 // console.log(formattedItemDate, start, end);
//                 // console.log(formattedItemDate >= start);
//                 if (
//                     formattedItemDate < start ||
//                     formattedItemDate > end
//                 ) {
//                     return false;
//                 }
//             }
//             if (startDateObj) {
//                 const formattedItemDate = `${itemDate.getMonth() + 1}/${itemDate.getDate()}/${itemDate.getFullYear()}`;
//                 const start = `${startDateObj.getMonth() + 1}/${startDateObj.getDate()}/${startDateObj.getFullYear()}`;
//                 if (
//                     formattedItemDate < start
//                 ) {
//                     return false;
//                 }
//             }
//             if (endDateObj) {
//                 const formattedItemDate = `${itemDate.getMonth() + 1}/${itemDate.getDate()}/${itemDate.getFullYear()}`;
//                 const end = `${endDateObj.getMonth() + 1}/${endDateObj.getDate()}/${endDateObj.getFullYear()}`;
//                 if (
//                     formattedItemDate > end
//                 ) {
//                     return false;
//                 }
//             }

//             // Check the user name
//             if (creatorname && !item?.username?.toLowerCase().includes(creatorname.toLowerCase())) {
//                 return false;
//             }

//             return true;
//         });

//         settabledata(filteredData);
//         console.log(tabledata);
//         console.log(filteredData);
//     };

//     return (
//         <> <div className='fade-in'>
//             <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
//                 <h3 style={{ color: 'white' }}>Challenge Manager</h3>
//             </div>
//             <section style={{ marginTop: '2rem' }} className="content">

//                 <div className="container-fluid" style={{ marginTop: '-35px' }}>
//                     <div className="row">
//                         {/* Primary table start */}
//                         <div className="col-12 mt-5">
//                             <div className="card">
//                                 <div style={{ background: '#a6a6ff' }} className="card-body">
//                                     {/* <form >
//                                         <input type="hidden" name="_token" defaultValue="ufIIKQky4pOtOxFVX1zXKHf58iF6SEHdlPsJf3tm" />
//                                         <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
//                                             <div className="form-group">
//                                                 <label>Pick a start date:</label>
//                                                 <div className="input-group date" id="datepicker" data-target-input="nearest">
//                                                     <input type="date"
//                                                         className="form-control t"
//                                                         placeholder="yyyy-mm-dd"
//                                                         name="start_date"
//                                                         value={startDate}
//                                                         onChange={handleStartDateChange} />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
//                                             <div className="form-group">
//                                                 <label>Pick a end date:</label>
//                                                 <div className="input-group date" id="datepicker1" data-target-input="nearest">
//                                                     <input type="date"
//                                                         className="form-control"
//                                                         placeholder="yyyy-mm-dd"
//                                                         name="end_date"
//                                                         value={endDate}
//                                                         onChange={handleEndDateChange} />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div style={{ clear: 'both' }} />
//                                         <div className='row'>
//                                             <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
//                                                 <label htmlFor="validationCustomUsername">Search </label>
//                                                 <div className="input-group">
//                                                     <input type="text" className="form-control" id="validationCustomUsername" defaultValue placeholder="Name,Username,number" aria-describedby="inputGroupPrepend" name="user" />
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
//                                                 <div id="table_id_filter" className="dataTables_filter">
//                                                     <label>
//                                                         Filter by Status:

//                                                     </label>
//                                                     <select
//                                                         style={{ height: "37px" }}
//                                                         className="form-control form-control-sm "
//                                                     >
//                                                         <option value="all">All</option>
//                                                         <option value="pending">Pending</option>
//                                                         <option value="rejected">Rejected</option>
//                                                         <option value="approved">Approved</option>
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div style={{ clear: 'both' }} />
//                                         <div style={{ clear: 'both' }} />
//                                         <br />
//                                         <div className="col-md-12 mb-12">
//                                             <center>
//                                                 <button className="btn btn-primary" type='button'>Search Now</button>
//                                                 <button className='btn btn-success' type='button' style={{ marginLeft: 20, textAlign: 'center' }} onClick={handleReset}>Reset</button>
//                                             </center>
//                                         </div>
//                                         <br />
//                                     </form> */}
//                                     <form role="form" type="submit">
//                                         {/* <input type="hidden" name="_token" defaultValue="eLkpGsUBYr9izTDYhoNZCCY6pxm06c8hRkw1N41O" /> */}
//                                         <div className='col-md-6 col-12 mb-3'>

//                                             <div className="form-group ">
//                                                 <label>Pick a start date:</label>
//                                                 <div className="input-group date" id="datepicker" data-target-input="nearest">
//                                                     <input type="date" className="form-control t" placeholder="yyyy-mm-dd" name="start_date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
//                                                 </div>
//                                             </div>

//                                             <div className="col-md-6 col-12 mb-3" >
//                                                 <div className="form-group ">
//                                                     <label>Pick a end date:</label>
//                                                     <div className="input-group date" id="datepicker1" data-target-input="nearest">
//                                                         <input type="date" className="form-control " placeholder="yyyy-mm-dd" name="end_date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>


//                                         <div style={{ clear: 'both' }} />
//                                         <div className="col-md-6 col-12 mb-3" >
//                                             <label htmlFor="validationCustomUsername"> User Name</label>
//                                             <div className="input-group">
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     placeholder="Username"
//                                                     name="userid"
//                                                     value={creatorname}
//                                                     onChange={(e) => setCreatorname(e.target.value)}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6 col-md-12" >
//                                             <label htmlFor="validationCustomUsername">Select id status</label>
//                                             <select className="form-control" name="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
//                                                 <option value> ----Select---- </option>
//                                                 <option value="all">All</option>
//                                                 <option value="pending">Pending</option>
//                                                 <option value="rejected">Rejected</option>
//                                                 <option value="approved">Approved</option>
//                                             </select>
//                                         </div>
//                                         {/* <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
//                                                 <label htmlFor="validationCustomUsername">Type</label>
//                                                 <div className="input-group">
//                                                     <input type="text" className="form-control" placeholder="Type" defaultValue name="type_id" />
//                                                 </div>
//                                             </div> */}

//                                         <div className='row' />
//                                         <br />
//                                         <div className="col-12">
//                                             <center>
//                                                 <button className="btn btn-primary" onClick={(e) => handleSearch(e)} >Search Now</button>
//                                                 <button className="button-reset btn btn-info" style={{ marginLeft: '20px' }} type="button" onClick={handleReset}>Reset <span><RotateLeftIcon /></span> </button>

//                                             </center>
//                                         </div>
//                                         <br />
//                                     </form>
//                                     <div className="single-table">
//                                         <div className="table-responsive">
//                                             {/* fund history */}
//                                             <div id="table_id_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">


//                                                 <table className="table text-center dataTable no-footer dtr-inline" id="table_id" role="grid" aria-describedby="table_id_info" style={{}}>
//                                                     <thead className="text-capitalize">

//                                                         {/* <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">SR. NO.</th> */}
//                                                         <tr role="row">
//                                                             <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">Sr.No.</th>
//                                                             <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Creator </th>
//                                                             <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Accepter </th>
//                                                             <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Amount</th>
//                                                             <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Status</th>
//                                                             <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Game Type </th>
//                                                             <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 129 }} aria-label="Date: activate to sort column ascending">Date</th>
//                                                             <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Time </th>
//                                                         </tr>

//                                                     </thead>
//                                                     <tbody>
//                                                         {renderedTableRows}
//                                                     </tbody>
//                                                 </table>

//                                             </div>
//                                             <br /><br />
//                                             <center>
//                                                 <div>
//                                                 </div>
//                                             </center>
//                                             <div className="pagination-container">
//                                                 <TablePagination sx={{ color: 'purple' }}
//                                                     rowsPerPageOptions={[5, 10, 25]}
//                                                     component="div"
//                                                     count={filteredData.length}
//                                                     rowsPerPage={rowsPerPage}
//                                                     page={page}
//                                                     onPageChange={handleChangePage}
//                                                     onRowsPerPageChange={handleChangeRowsPerPage}
//                                                 />
//                                             </div>
//                                             {/* fund history */}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Primary table end */}

//                     </div>
//                 </div>
//             </section>
//         </div>

//         </>
//     )
// }

// export default UserManager;


import React, { useRef, useState, useEffect } from 'react'
import * as FileSaver from 'file-saver';
import axios from 'axios';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf"
import { TablePagination } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { baseURL } from '../token';
import { handleUnAuthorized } from './hooks/handleUnAuthorized';
import { useNavigate } from 'react-router-dom';

function UserManager() {
    const navigate = useNavigate()
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [creatorname, setCreatorname] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tabledata, settabledata] = useState([]);
    const [iconRotation, setIconRotation] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [acceptorname, setAcceptorname] = useState("");

    const fetchAdmindata = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const response = await axios.get(`${baseURL}/challenge`, {
                headers: headers,
            });

            if (response.status === 200) {
                const users = response?.data?.data?.rows;

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
                console.log(users);
                settabledata(users);
                // Wait for all promises to resolve
                // const userDataWithGames = await Promise.all(userPromises);
                // settabledata(userDataWithGames);
            }
        } catch (error) {
            console.log(error);
            handleUnAuthorized(error.response.data, navigate)
        }
    };

    useEffect(() => {
        fetchAdmindata();
    }, [])

    const handleStatusFilterChange = (event) => {
        // setStatusFilter(event.target.value);
        setSelectedStatus(event.target.value);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setCreatorname('');
        setAcceptorname('');
        setSelectedStatus('')
        settabledata(tabledata);
        // setIconRotation(iconRotation + 360); // Rotate the icon by 360 degrees
        fetchAdmindata()
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate the index range for the current page
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const filteredData = tabledata.filter(data => {
        if (!startDate || !endDate) {
            return true;
        }
        const dataDate = new Date(data.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return dataDate >= start && dataDate <= end;
    });


    // const filteredTableData = statusFilter === 'all'
    //     ? tableData
    //     : tableData.filter(data => data.status === statusFilter);

    const renderedTableRows = filteredData.slice(startIndex, endIndex).map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();

        return (
            <tr role="row" key={index}>
                <td>{index + 1}</td>
                <td>{data?.roomcode}</td>
                <td>{data?.ChallengerUser?.username}</td>
                <td>{data?.AcceptorUser?.username}</td>
                <td>{data?.price}</td>
                <td>{data?.result?.WinnerUser?.username}</td>
                <td>{data?.status}</td>
                <td>{data?.category == "quick" ? "classic" : "snake"}</td>
                <td>{formattedDate}</td>
                <td>{formattedTime}</td>
            </tr>
        );
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const filteredData = tabledata?.filter((item) => {
            const itemDate = new Date(item?.createdAt);
            const startDateObj = startDate ? new Date(startDate) : null;
            const endDateObj = endDate ? new Date(endDate) : null;

            // Check the date range
            if (startDateObj && endDateObj) {
                // Format the item date in the same format as your input (MM/DD/YYYY)
                const formattedItemDate = `${itemDate.getMonth() + 1}/${itemDate.getDate()}/${itemDate.getFullYear()}`;
                const start = `${startDateObj.getMonth() + 1}/${startDateObj.getDate()}/${startDateObj.getFullYear()}`;
                const end = `${endDateObj.getMonth() + 1}/${endDateObj.getDate()}/${endDateObj.getFullYear()}`;
                // console.log(start);
                // console.log(formattedItemDate, start, end);
                // console.log(formattedItemDate >= start);
                if (
                    formattedItemDate < start ||
                    formattedItemDate > end
                ) {
                    return false;
                }
            }
            if (startDateObj) {
                const formattedItemDate = `${itemDate.getMonth() + 1}/${itemDate.getDate()}/${itemDate.getFullYear()}`;
                const start = `${startDateObj.getMonth() + 1}/${startDateObj.getDate()}/${startDateObj.getFullYear()}`;
                if (
                    formattedItemDate < start
                ) {
                    return false;
                }
            }
            if (endDateObj) {
                const formattedItemDate = `${itemDate.getMonth() + 1}/${itemDate.getDate()}/${itemDate.getFullYear()}`;
                const end = `${endDateObj.getMonth() + 1}/${endDateObj.getDate()}/${endDateObj.getFullYear()}`;
                if (
                    formattedItemDate > end
                ) {
                    return false;
                }
            }

            // Check the user name
            if (creatorname && !item?.ChallengerUser?.username?.toLowerCase().includes(creatorname.toLowerCase())) {
                return false;
            }
            if (acceptorname && !item?.AcceptorUser?.username?.toLowerCase().includes(acceptorname.toLowerCase())) {
                return false;
            }

            if (selectedStatus !== "" && item?.status !== selectedStatus) {
                return false;
            }
            return true;
        });

        settabledata(filteredData);
        console.log(tabledata);
        console.log(filteredData);
    };

    return (
        <> <div className='fade-in'>
            <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                <h3 style={{ color: 'white' }}>Challenge Manager</h3>
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
                                        <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                            <label>Select status: </label>
                                            <select className="form-control" name="status" value={selectedStatus} onChange={handleStatusFilterChange}>
                                                {/* <option value> ----Select---- </option> */}
                                                <option value="all">All</option>
                                                <option value="judgement">judgement</option>
                                                <option value="created">created</option>
                                                <option value="running">running</option>
                                                <option value="completed">completed</option>
                                                <option value="cancelled">cancelled</option>
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
                                                            <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">Room Code</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Creator </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Accepter </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Amount</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Winner_Name</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Status</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Game Type </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 129 }} aria-label="Date: activate to sort column ascending">Date</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Time </th>
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
                                            <div className="pagination-container">
                                                <TablePagination sx={{ color: 'purple' }}
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={filteredData.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
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

export default UserManager;
