import React, { useState, useEffect } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';
import { Visibility, Check } from '@mui/icons-material';
import ImageViewer from './ImageViewer';
import { baseURL } from '../token';
import axios from 'axios';
import "../Components/styles/AdminManager.css"
import TablePagination from '@mui/material/TablePagination';

import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { handleUnAuthorized } from './hooks/handleUnAuthorized';
import Swal from 'sweetalert2';

function AdminPanelTable() {
    const [activeTableData, setActiveTableData] = useState([]);
    const [inactiveTableData, setInactiveTableData] = useState([])
    // const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Pending', 'Completed', 'In Progress', 'Cancelled'

    const navigate = useNavigate();
    const [selectedUserIndex, setSelectedUserIndex] = useState(-1); // Initialize with -1

    const [activePage, setActivePage] = useState(1);
    const [noOfAdmin, setNoOfAdmin] = useState(0);
    const [noOfSubadmin, setNoOfSubadmin] = useState(0);
    const [activeRowsPerPage, setActiveRowsPerPage] = useState(10);

    const [inactivePage, setInactivePage] = useState(1);
    const [inactiveRowsPerPage, setInactiveRowsPerPage] = useState(10);

    const [permissions, setPermissions] = useState({
        block_user: false,
        add_coins: false,
        withdraw_coins: false,
        challenge_result: false,
        settings: false,
        manage_admin: false,
    });

    const handleEditClick = (index) => {
        setSelectedUserIndex(index); // Set the selected user index
    };
    const handleActivePageChange = (data) => {
        setActivePage(data.selected + 1);
    };

    const handleActiveRowsPerPageChange = (event) => {
        setActiveRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleInactivePageChange = (data) => {
        setInactivePage(data.selected + 1);
    };

    const handleInactiveRowsPerPageChange = (event) => {
        setInactiveRowsPerPage(parseInt(event.target.value, 10));
    };

    const handlePermissionChange = (event) => {
        const { name, checked } = event.target;
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [name]: checked,
        }));
    };

    // const handleEditClick = (index) => {
    //     setSelectedUserIndex(index);

    //     // Assuming you have the permissions data for the selected admin
    //     const selectedUserPermissions = {
    //         block_user: true, // Set to true or false based on your data
    //         add_coins: false,
    //         withdraw_coins: false,
    //         challenge_result: false,
    //         settings: false,
    //         manage_admin: false,
    //     };

    //     setPermissions(selectedUserPermissions);
    // };

    // const handleSavePermissions = () => {
    //     // Assuming you have the adminId of the selected user and updated permissions
    //     const adminId = activeTableData[selectedUserIndex]?.adminId; // Replace with your data retrieval logic
    //     const updatedPermissions = permissions;
    //     // console.log(permissions);
    //     // const paramss= {
    //     //     permission: permissions
    //     // }
    //     // const response = axios
    //     setSelectedUserIndex(-1);
    // };


    const handleCloseEditModal = () => {
        // Reset the selected user index to close the modal
        setSelectedUserIndex(-1);
        // fetchUserData();
    };

    const handleSaveInactivePermissions = async () => {
        try {
            console.log(inactiveTableData);
            const adminId = inactiveTableData[selectedUserIndex]?.id; // Replace with your data retrieval logic
            const updatedPermissions = {
                block_user: permissions.block_user,
                add_coins: permissions.add_coins,
                withdraw_coins: permissions.withdraw_coins,
                challenge_result: permissions.challenge_result,
                settings: permissions.settings,
                manage_admin: permissions.manage_admin,
            };

            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const response = await axios.post(`${baseURL}/admin/permissions`, {
                adminId: adminId,
                permission: updatedPermissions,
            }, {
                headers: headers,
            });

            // Handle the response as needed (e.g., show a success message)
            console.log('Permission update successful:', response.data);
            setSelectedUserIndex(-1);
        } catch (error) {
            // Handle errors (e.g., show an error message)
            console.error('Error updating permissions:', error);
        }
    };
    const handleSavePermissions = async () => {
        try {
            console.log(activeTableData);
            const adminId = activeTableData[selectedUserIndex]?.id; // Replace with your data retrieval logic
            const updatedPermissions = {
                block_user: permissions.block_user,
                add_coins: permissions.add_coins,
                withdraw_coins: permissions.withdraw_coins,
                challenge_result: permissions.challenge_result,
                settings: permissions.settings,
                manage_admin: permissions.manage_admin,
            };

            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const response = await axios.post(`${baseURL}/admin/permissions`, {
                adminId: adminId,
                permission: updatedPermissions,
            }, {
                headers: headers,
            });

            // Handle the response as needed (e.g., show a success message)
            console.log('Permission update successful:', response.data);
            setSelectedUserIndex(-1);
        } catch (error) {
            // Handle errors (e.g., show an error message)
            console.error('Error updating permissions:', error);
        }
    };

    const deleteSubAdmin = (id) => {
        const confirm = window.confirm("Are you sure, you want to delete sub admin?");
        if (confirm) {
            const access_token = localStorage.getItem('access_token')
            const headers = {
                Authorization: `Bearer ${access_token}`
            }
            axios.post(baseURL + `agent/delete/${id}`, {}, { headers })
                .then((res) => {
                    // setAgent(res.data)
                    Swal.fire({
                        icon: "success",
                        title: "Successfully",
                        text: 'Subadmin delete successfully.',
                      });
                      fetchSubadminData()
                })
                .catch((e) => {
                    console.log(e);
                    handleUnAuthorized(e.response.data, navigate)
                })
        }
    }

    const renderedActiveTableRows = activeTableData.map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();
        return (
            <TableRow key={index}>
                <TableCell>{index + 1 + (activePage - 1) * activeRowsPerPage}</TableCell>
                <TableCell>{data.Name}</TableCell>
                {/* <TableCell>{data.username}</TableCell> */}
                <TableCell>{data.Phone}</TableCell>
                <TableCell>{data.Email}</TableCell>
                {/* <TableCell>{data.status}</TableCell> */}
                {/* <TableCell>
                    <Button onClick={() => handleEditClick(index)}>Edit</Button>
                    {selectedUserIndex === index && (
                        <div>
                            <p>Edit Permissions</p>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="block_user"
                                        checked={permissions.block_user}
                                        onChange={handlePermissionChange}
                                    />
                                    Block User
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="add_coins"
                                        checked={permissions.add_coins}
                                        onChange={handlePermissionChange}
                                    />
                                    Add Coins
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="withdraw_coins"
                                        checked={permissions.withdraw_coins}
                                        onChange={handlePermissionChange}
                                    />
                                    Withdraw coins
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="challenge_result"
                                        checked={permissions.challenge_result}
                                        onChange={handlePermissionChange}
                                    />
                                    Challenge Result
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="settings"
                                        checked={permissions.settings}
                                        onChange={handlePermissionChange}
                                    />
                                    Settings
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="manage_admin"
                                        checked={permissions.manage_admin}
                                        onChange={handlePermissionChange}
                                    />
                                    Manage Admin
                                </label>
                            </div>
                            {/* <div>
                                <Checkbox id="permission1" name="permission1" />
                                <label htmlFor="permission1">Permission 1</label>
                            </div>
                            <div>
                                <Checkbox id="permission2" name="permission2" />
                                <label htmlFor="permission2">Permission 2</label>
                            </div>
                            <div>
                                <Checkbox id="permission3" name="permission3" />
                                <label htmlFor="permission3">Permission 3</label>
                            </div>
                            <div>
                                <Checkbox id="permission4" name="permission4" />
                                <label htmlFor="permission4">Permission 4</label>
                            </div> 
                            <Button onClick={handleCloseEditModal}>Cancel</Button>
                            <Button onClick={handleSavePermissions}>Send</Button>
                        </div>
                    )}
                </TableCell> */}

                <TableCell>{formattedDate}</TableCell>
                <TableCell>{formattedTime}</TableCell>
            </TableRow>
        )
    });

    const renderedInactiveTableRows = inactiveTableData.map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();
        return (
            <TableRow key={index}>
                <TableCell>{index + 1 + (inactivePage - 1) * inactiveRowsPerPage}</TableCell>
                <TableCell>{data.Name}</TableCell>
                {/* <TableCell>{data.username}</TableCell> */}
                <TableCell>{data.Phone}</TableCell>
                <TableCell>{data.Email}</TableCell>
                {/* <TableCell>{data.status}</TableCell> */}
                <TableCell>
                    <button type="button" onClick={() => navigate(`/agent/permissions`, { state: { id: data?._id } })} className="btn btn-outline-info ">Grant Permission</button>
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{formattedTime}</TableCell>
                <TableCell>
                    <button type='button' className={`btn  mx-1 btn-danger`} onClick={() => { deleteSubAdmin(data?._id) }}>delete</button>
                </TableCell>
            </TableRow>
        )
    });

    const fetchAdminData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const response = await axios.get(baseURL + `admin/all?_limit=${activeRowsPerPage}&page=${activePage}`, {
                headers: headers,
            });

            // const activeUsers = response.data.data.filter(user => user.status === 'active');
            // const inactiveUsers = response.data.data.filter(user => user.status === 'inactive');
            setNoOfAdmin(response.data.totalPages)
            setActiveTableData(response.data.admin);
            // setInactiveTableData(inactiveUsers);
        } catch (err) {
            console.log(err);
            handleUnAuthorized(err.response.data, navigate)
        }
    };

    const fetchSubadminData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const response = await axios.get(baseURL + `agent/all?_limit=${inactiveRowsPerPage}&page=${inactivePage}`, {
                headers: headers,
            });

            // const activeUsers = response.data.data.filter(user => user.status === 'active');
            // const inactiveUsers = response.data.data.filter(user => user.status === 'inactive');
            setNoOfSubadmin(response.data.totalPages)
            setInactiveTableData(response.data.admin);
        } catch (err) {
            console.log(err);
            handleUnAuthorized(err.response.data, navigate)
        }
    };

    useEffect(() => {
        fetchAdminData();
        fetchSubadminData()
    }, [activePage, activeRowsPerPage]);

    return (
        <>
            {/* <section style={{ paddingTop: '5rem' }} className="content">
                <div className="container-fluid" style={{ marginTop: '-35px' }}>
                    <div className="row">
                        <div className="col-12 mt-5">
                            <div className="card">
                                <div className="card-body">
                                    <form >
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
                                        <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                            <label htmlFor="validationCustomUsername">Search  User</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" id="validationCustomUsername" defaultValue placeholder="Name,Username,number" aria-describedby="inputGroupPrepend" name="user" />
                                            </div>
                                        </div>
                                        <div style={{ clear: 'both' }} />
                                        <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                            <label>Select an Option:</label>
                                            <select
                                                className="form-control"
                                                value={selectedOption}
                                                onChange={handleDropdownChange}
                                                name="dropdownOption"
                                            >
                                                <option value="">Select an option</option>
                                                {options.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ clear: 'both' }} />
                                        <br />
                                        <div className="col-md-12 mb-12">
                                            <center>
                                                <button className="btn btn-primary" style={{}} >Search Now</button>
                                                <button className='btn btn-success' type='button' style={{ marginLeft: 20, textAlign: 'center' }} onClick={handleReset}>Reset</button>

                                            </center>
                                        </div>
                                        <br />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section > */}
            <div className='fade-in'>
                <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                    <h3 style={{ color: 'white' }}>Admin Manager</h3>
                </div>
                <section style={{ marginTop: '5rem', borderRadius: '5px', background: '#a6a6ff' }} >
                    <button style={{ margin: '2rem' }} type="button" class="btn  hoverbutton" onClick={() => navigate('/register')} >Create Admin</button>
                    <section style={{ paddingTop: '1rem' }} className="content">
                        <div className="container-fluid" style={{ marginTop: '-35px' }}>
                            <div className="row">
                                <div className="col-12 mt-4">
                                    <span className='mb-1 text-black' style={{ color: 'black!important', fontWeight: '700', fontSize: '20px' }}>All Admin List</span>
                                    <div className="card">

                                        <div style={{ background: 'white' }} className="card-body">
                                            <div className="single-table">
                                                <div id="active_table_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                                                    <div className="table-responsive">
                                                        <Table sx={{ background: 'white' }} >
                                                            <TableHead>
                                                                <TableRow sx={{ background: 'white  ' }}>
                                                                    <TableCell>Sr No.</TableCell>
                                                                    <TableCell>Name</TableCell>
                                                                    {/* <TableCell>Username</TableCell> */}
                                                                    <TableCell>Phone</TableCell>
                                                                    <TableCell>Email</TableCell>
                                                                    {/* <TableCell>Status</TableCell> */}
                                                                    {/* <TableCell>Edit Permission</TableCell> */}
                                                                    <TableCell>Date</TableCell>
                                                                    <TableCell>Time</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>{renderedActiveTableRows}</TableBody>
                                                        </Table>
                                                    </div>
                                                    <div className="dataTables_info" id="active_table_info" role="status" aria-live="polite">
                                                        Showing {activeTableData.length} active entries
                                                    </div>
                                                </div>

                                                {/* <TablePagination
                                                    component="div"
                                                    count={noOfAdmin}
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    rowsPerPage={activeRowsPerPage}
                                                    page={activePage}
                                                    onPageChange={handleActivePageChange}
                                                    onRowsPerPageChange={handleActiveRowsPerPageChange}
                                                /> */}
                                                <div className='mt-4'>
                                                    <ReactPaginate
                                                        previousLabel={"Previous"}
                                                        nextLabel={"Next"}
                                                        breakLabel={"..."}
                                                        pageCount={noOfAdmin}
                                                        marginPagesDisplayed={2}
                                                        pageRangeDisplayed={3}
                                                        onPageChange={handleActivePageChange}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                            <div className="row">
                                <div className="col-12 mt-4">
                                    <span className='mb-1 text-black' style={{ color: 'black!important', fontWeight: '700', fontSize: '20px' }}>All Subadmin List</span>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="single-table">
                                                <div id="inactive_table_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                                                    <div className="table-responsive">
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Sr No.</TableCell>
                                                                    <TableCell>Name</TableCell>
                                                                    {/* <TableCell>Username</TableCell> */}
                                                                    <TableCell>Phone</TableCell>
                                                                    <TableCell>Email</TableCell>
                                                                    {/* <TableCell>Status</TableCell> */}
                                                                    <TableCell>Edit Permission</TableCell>
                                                                    <TableCell>Date</TableCell>
                                                                    <TableCell>Time</TableCell>
                                                                    <TableCell>Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>{renderedInactiveTableRows}</TableBody>
                                                        </Table>
                                                    </div>
                                                    <div className="dataTables_info" id="inactive_table_info" role="status" aria-live="polite">
                                                        Showing {inactiveTableData.length} inactive entries
                                                    </div>
                                                </div>

                                                {/* <TablePagination
                                                    component="div"
                                                    count={noOfSubadmin}
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    rowsPerPage={inactiveRowsPerPage}
                                                    page={inactivePage}
                                                    onPageChange={handleInactivePageChange}
                                                    onRowsPerPageChange={handleInactiveRowsPerPageChange}
                                                /> */}

                                                <div className='mt-4'>
                                                    <ReactPaginate
                                                        previousLabel={"Previous"}
                                                        nextLabel={"Next"}
                                                        breakLabel={"..."}
                                                        pageCount={noOfSubadmin}
                                                        marginPagesDisplayed={2}
                                                        pageRangeDisplayed={3}
                                                        onPageChange={handleInactivePageChange}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </section >
                </section>
            </div>
        </>
    );
}

export default AdminPanelTable;