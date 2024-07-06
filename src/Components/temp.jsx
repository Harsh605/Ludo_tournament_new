
import { Box, Input, MenuItem, Select, colors } from '@mui/material';
import React, { useState } from 'react'
import { styled } from '@mui/system';
import { Pagination, PaginationItem, ArrowBackIcon, ArrowForwardIcon } from '@mui/material';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';


function Challenge() {
    const [currentPage, setCurrentPage] = useState(1);
    const [tabledata, setTabledata] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [games, setGames] = useState(tabledata);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Pending', 'Completed', 'In Progress', 'Cancelled'
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    // Filter the games based on the search term, date range, and status
    const filteredData = games.filter((game) => {
        const isMatchingCreator = game.creater.toLowerCase().includes(searchTerm.toLowerCase());
        const isMatchingDate = (startDate === '' || game.date >= startDate) && (endDate === '' || game.date <= endDate);
        const isMatchingStatus = statusFilter === 'All' || game.status === statusFilter;
        return isMatchingCreator && isMatchingDate && isMatchingStatus;
    });


    //paginations area 

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = currentPage * ITEMS_PER_PAGE;


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleResetFilter = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setStatusFilter('All');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleReset = (e) => {
        e.preventDefault()
        console.log("hwyy");
        setStartDate('');
        setEndDate('');
    };
    const handlePenaltyChange = (index, newPenalty) => {
        const newPenalties = [...penalties];
        newPenalties[index] = newPenalty;
        setPenalties(newPenalties);
        setEditingIndex(null);
    };

    const renderedTableRows = filteredData.slice(startIndex, endIndex).map((data, index) => (
        <tr role="row" key={index}>
            {/* <td>{data.id}</td> */}
            <td>{data.id}</td>
            <td>{data.creater}</td>
            <td>{data.accepter}</td>
            <td>{data.amount}</td>
            <td>{data.status}</td>
            <td>{data.gameType}</td>
            <td>{data.date}</td>
        </tr>
    ));

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - renderedTableRows.length) : 0;


    const fetchChallenge = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            console.log(headers);
            const response = await axios.get(baseURL + '/challenge', {
                headers: headers,
            });

            console.log(response.data);
            // gamejudgement();
            setTabledata(response?.data?.data);
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchChallenge();
    }, [])

    return (
        <> <div className='fade-in'>
            <div style={{ paddingLeft: '2rem', marginTop: '4rem', paddingBottom: '2rem', borderBottom: '1px solid white' }}>
                <h3 style={{ color: 'white' }}> Challenge Manager</h3>
            </div>
            <section style={{ marginTop: '5rem' }} className="content">
                <div className="container-fluid" style={{ marginTop: '-35px' }}>
                    <div className="row">
                        {/* Primary table start */}
                        <div className="col-12 mt-5">
                            <div className="card">
                                <div style={{ background: '#a6a6ff' }} className="card-body">
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

                                                        // value={statusFilter}
                                                        // onChange={handleStatusFilterChange}
                                                        style={{ height: "37px" }}
                                                        className="form-control form-control-sm "
                                                    >
                                                        <option value="all">All</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="approved">Approved</option>
                                                    </select>
                                                </div>
                                                {/* <label>Select an Option:</label>
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
                                            </select> */}
                                            </div>
                                        </div>
                                        <div style={{ clear: 'both' }} />
                                        <div style={{ clear: 'both' }} />
                                        <br />
                                        <div className="col-md-12 mb-12">
                                            <center>
                                                <button className="btn btn-primary" type='button' style={{}} >Search Now</button>
                                                <button className='btn btn-success' type='button' style={{ marginLeft: 20, textAlign: 'center' }} onClick={handleReset}>Reset</button>
                                                {/* <button onClick={handleReset}>Reset</button> */}
                                            </center>
                                        </div>
                                        <br />
                                    </form>
                                    <div className="single-table">
                                        <div className="table-responsive">
                                            {/* fund history */}
                                            <div id="table_id_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">

                                                <div id="table_id_filter" className="dataTables_filter">
                                                </div>
                                                <table className="table text-center dataTable no-footer dtr-inline" id="table_id" role="grid" aria-describedby="table_id_info">
                                                    <thead className="text-capitalize">

                                                        {/* <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">SR. NO.</th> */}
                                                        <tr role="row">
                                                            {/* <th className="sorting_asc" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 101 }} aria-sort="ascending" aria-label="SR. NO.: activate to sort column descending">Number</th> */}
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 76 }} aria-label="From: activate to sort column ascending">ID </th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 105 }} aria-label="To User: activate to sort column ascending">Creator</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 175 }} aria-label="To User Name: activate to sort column ascending">Accepter</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 109 }} aria-label="Amount: activate to sort column ascending">Amount</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 129 }} aria-label="Date: activate to sort column ascending">Status</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Game Type</th>
                                                            <th className="sorting" tabIndex={0} aria-controls="table_id" rowSpan={1} colSpan={1} style={{ width: 81 }} aria-label="Time: activate to sort column ascending">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            rowsPerPage > 0
                                                                ? renderedTableRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                : renderedTableRows
                                                        }
                                                        {emptyRows > 0 && (
                                                            <tr style={{ height: 34 * emptyRows }}>
                                                                <td colSpan={3} />
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                    <tfoot>
                                                        {/* <tr>
                              <CustomTablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={renderedTableRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                  select: {
                                    'aria-label': 'rows per page',
                                  },
                                  actions: {
                                    showFirstButton: true,
                                    showLastButton: true,
                                  },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                              />
                            </tr> */}
                                                    </tfoot>
                                                </table>
                                                <div className="pagination-container">
                                                    <Pagination
                                                        count={totalPages}
                                                        page={currentPage}
                                                        onChange={(event, page) => setCurrentPage(page)}
                                                        renderItem={(item) => (
                                                            <PaginationItem
                                                                component="a"
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setCurrentPage(item.page);
                                                                }}
                                                                {...item}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                {/* <div className="dataTables_info" id="table_id_info" role="status" aria-live="polite">
                            Showing 1 to 2 of 2 entries
                          </div>
                          <div className="dataTables_paginate paging_simple_numbers" id="table_id_paginate">
                            <ul className="pagination"><li className="paginate_button page-item previous disabled" id="table_id_previous">
                              <a href="#" aria-controls="table_id" data-dt-idx={0} tabIndex={0} className="page-link">
                                Previous
                              </a></li><li className="paginate_button page-item active">
                                <a href="#" aria-controls="table_id" data-dt-idx={1} tabIndex={0} className="page-link">1</a></li><li className="paginate_button page-item next disabled" id="table_id_next"><a href="#" aria-controls="table_id" data-dt-idx={2} tabIndex={0} className="page-link">Next</a></li></ul></div> */}
                                            </div>
                                            <br /><br />
                                            <center>
                                                <div>
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
            {/* <Box>

        <div className="game-table-container">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Creater</th>
                <th>Accepter</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Game Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game) => (
                <tr key={game.id}>
                  <td>{game.id}</td>
                  <td>{game.creater}</td>
                  <td>{game.accepter}</td>
                  <td>{game.amount}</td>
                  <td>{game.status}</td>
                  <td>{game.gameType}</td>
                  <td>{game.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </Box> */}
        </>
    )
}

export default Challenge;



        // <div className="container_mt-4">
        //   {/* <div className="table-header"> */}
        //   <div className="mb-3">
        //     <form >
        //       <input type="hidden" name="_token" defaultValue="ufIIKQky4pOtOxFVX1zXKHf58iF6SEHdlPsJf3tm" />
        //       <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
        //         <div className="form-group">
        //           <label>Pick a start date:</label>
        //           <div className="input-group date" id="datepicker" data-target-input="nearest">
        //             <input type="date"
        //               className="form-control t"
        //               placeholder="yyyy-mm-dd"
        //               name="start_date"
        //               value={startDate}
        //               onChange={handleStartDateChange} />
        //           </div>
        //         </div>
        //       </div>
        //       <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
        //         <div className="form-group">
        //           <label>Pick a end date:</label>
        //           <div className="input-group date" id="datepicker1" data-target-input="nearest">
        //             <input type="date"
        //               className="form-control"
        //               placeholder="yyyy-mm-dd"
        //               name="end_date"
        //               value={endDate}
        //               onChange={handleEndDateChange} />
        //           </div>
        //         </div>
        //       </div>
        //       <div style={{ clear: 'both' }} />
        //       <div className="col-md-6 mb-6" style={{ float: 'left', marginTop: 10 }}>
        //         <label htmlFor="validationCustomUsername">Search  User</label>
        //         <div className="input-group">
        //           <input type="text" className="form-control" id="validationCustomUsername" defaultValue placeholder="Name,Username,number" aria-describedby="inputGroupPrepend" name="user" />
        //         </div>
        //       </div>
        //       <div style={{ clear: 'both' }} />
        //       <div style={{ clear: 'both' }} />
        //       <br />
        //       <div className="col-md-12 mb-12">
        //         <center>
        //           <button className="btn btn-primary" style={{}} >Search Now</button>
        //           <button className='btn btn-success' type='button' style={{ marginLeft: 20, textAlign: 'center' }} onClick={handleReset}>Reset</button>
        //           {/* <button onClick={handleReset}>Reset</button> */}
        //         </center>
        //       </div>
        //       <br />
        //     </form>
        //     {/* <label>Start Date:</label>
        //     <input
        //       type="date"
        //       className="form-control"
        //       value={startDate}
        //       onChange={handleStartDateChange}
        //     /> */}
        //   </div>
        //   {/* <div className="mb-4">
        //     <label>End Date:</label>
        //     <input
        //       type="date"
        //       className="form-control"
        //       value={endDate}
        //       onChange={handleEndDateChange}
        //     />
        //   </div>
        //   <div className="mb-3">

        //     <input
        //       type="text"
        //       className="form-control1"
        //       placeholder="Search by Creator"
        //       value={searchTerm}
        //       onChange={handleSearch}
        //     />
        //   </div>  */}
        //   {/*
        //   <div className="mb-3">
        //     <Select sx={{ width: "100%", border: "1px solid white", height: "40px", color: 'white', outline: "none", backgroundColor: '#15236e', transform: 'translate(600px,-55px)' }}
        //       value={statusFilter}
        //       onChange={handleStatusChange}
        //     >

        //       <MenuItem value="All">All</MenuItem>
        //       <MenuItem value="Pending">Pending</MenuItem>
        //       <MenuItem value="Completed">Completed</MenuItem>
        //       <MenuItem value="Running">Running</MenuItem>
        //       <MenuItem value="Cancelled">Cancelled</MenuItem>
        //     </Select>
        //   </div> */}
        //   <div className="reset-button-container">
        //     <button className="btn btn-secondary" onClick={handleResetFilter}>Reset Filters <span><RotateLeftIcon /></span></button>
        //   </div>
        //   {/* </div> */}
        // </div>