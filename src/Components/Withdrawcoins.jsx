import React, { useState, useEffect } from 'react'
import { Button, Pagination, PaginationItem, TextField } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import ImageViewer from './ImageViewer';
import { baseURL } from '../token';
import axios from 'axios';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import TablePagination from '@mui/material/TablePagination';




function Withdrawcoins() {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [tableData, setTabledata] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [selectedOption, setSelectedOption] = useState(''); // State t
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = React.useState('all'); //
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
    const ITEMS_PER_PAGE = rowsPerPage;
    // Define options for the dropdown
    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        // Add more options as needed
    ];

    // Event handler for dropdown change
    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };


    // Calculate the start and end indices for the data slice based on the current page and rows per page.
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Slice the data to display only the items for the current page.
    const slicedData = tableData.slice(startIndex, endIndex);


    const withdrawcoins = async () => {
        try {

            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            // console.log(headers);
            const response = await axios.get(baseURL + '/admin/withdrawrequest', {
                headers: headers,
            });

            console.log(response.data.data);
            setTabledata(response.data.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const acceptreject = async (id, status, amount) => {
        try {
            const message = inputValues[id] || '';
            const requestbody = {
                id: id,
                message: message ? message : "no message",
                status: status,
                amount: amount
            }
            console.log(requestbody);
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            console.log(headers);
            const response = await axios.post(baseURL + '/admin/withdrawrequest/action', requestbody, {
                headers: headers,
            });

            console.log(response.data);
            withdrawcoins();
        }
        catch (err) {
            // alert(err?.data?.data?.data?.message)
            console.log(err);
        }
    };
    useEffect(() => {
        withdrawcoins();
    }, [])

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
        setStatusFilter('')
        setTabledata(tableData);
        // setIconRotation(iconRotation + 360); // Rotate the icon by 360 degrees
        withdrawcoins()
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const filteredData = tableData?.filter((item) => {
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
            console.log(searchQuery);
            console.log(item.user.username);
            console.log(statusFilter);
            console.log(item.status);

            if (searchQuery && !item?.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (statusFilter !== "" && item?.status !== statusFilter) {
                return false;
            }
            return true;
        });

        setTabledata(filteredData);
        console.log(tableData);
        console.log(filteredData);
    };
    // const filteredtableData = statusFilter === 'all'
    //     ? tableData
    //     : tableData.filter(data => data.status === statusFilter);

    const filteredData = tableData.filter(data => {
        if (!startDate || !endDate) {
            return true;
        }
        const dataDate = new Date(data.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return dataDate >= start && dataDate <= end;
    });
    const renderedTableRows = slicedData.map((data, index) => {
        const createdAt = new Date(data?.createdAt);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();

        return (<tr key={index}>
            <td>{index + 1}</td>
            <td>{data.amount}</td>
            <td>{data.user?.wallet?.amount}</td>
            <td>{data.user.username}</td>
            <td>{data.details}</td>
            <td>
                <TextField
                    type="text"
                    // style={{ color: 'black' }}
                    style={{ height: '30px', width: '200px', color: "black" }}
                    placeholder="Enter message"
                    variant="outlined"
                    size="small"
                    disabled={data.status !== 'pending'} // Disable when status is not 'pending'
                    onChange={(e) => {
                        setInputValues(prevInputValues => ({
                            ...prevInputValues,
                            [data.id]: e.target.value, // Store input value for specific row
                        }));
                    }}
                />
            </td>
            <td>{data.status}</td>
            {data.status === 'pending' ? (
                <>
                    <td>
                        <Button variant="contained" color="primary" onClick={() => acceptreject(data.id, "accepted", data.amount)}>Accept</Button>
                    </td>
                    <td>
                        <Button variant="contained" color="secondary" onClick={() => acceptreject(data.id, "rejected", data.amount)}>Reject</Button>
                    </td>
                </>
            ) : (
                <>
                    <td></td>
                    <td></td>
                </>
            )}
            <td>{formattedDate}</td>
            <td>{formattedTime}</td>
        </tr>)

    });



    return (

        <>
            <div className='fade-in'>
                <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                    <h3 style={{ color: 'white' }}> Withdraw Payment</h3>
                </div>
                <section style={{ paddingTop: '5rem' }} className="content">
                    <div className="container-fluid" style={{ marginTop: '-35px' }}>
                        <div className="row">
                            {/* Primary table start */}
                            <div className="col-12 mt-5">
                                <div className="card">
                                    <div style={{ background: '#a6a6ff' }} className="card-body">
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
                                                        <select className="form-control" name="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                                            <option value="all">All</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="rejected">Rejected</option>
                                                            <option value="approved">Approved</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
                                                <label htmlFor="validationCustomUsername">Type</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Type" defaultValue name="type_id" />
                                                </div>
                                            </div> */}

                                            <div className='row' />
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
                                            {/* fund history */}
                                            <div id="table_id_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">

                                                <div className="table-responsive">
                                                    <table className="table text-center dataTable no-footer dtr-inline" id="table_id" role="grid" aria-describedby="table_id_info" style={{}}>
                                                        <thead className="text-capitalize">

                                                            {/* <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">SR. NO.</th> */}
                                                            <tr role="row">
                                                                <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">Number</th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Amount </th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">Waallet_Amount </th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 175 }} aria-label="To User Name: activate to sort column ascending">User_Id</th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 175 }} aria-label="To User Name: activate to sort column ascending">UpiId</th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 109 }} aria-label="Amount: activate to sort column ascending">Message</th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 129 }} aria-label="Date: activate to sort column ascending">Status</th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Accept</th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Reject</th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Date</th>
                                                                <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Time</th>
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
                                                        <div className="pagination-container">


                                                            <TablePagination
                                                                component="div"
                                                                count={filteredData.length}
                                                                rowsPerPageOptions={[5, 10, 25]}
                                                                rowsPerPage={rowsPerPage}
                                                                page={currentPage - 1}
                                                                onPageChange={(event, newPage) => setCurrentPage(newPage + 1)}
                                                                onRowsPerPageChange={(event) => {
                                                                    setRowsPerPage(parseInt(event.target.value, 10));
                                                                    setCurrentPage(1);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </center>
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

export default Withdrawcoins
