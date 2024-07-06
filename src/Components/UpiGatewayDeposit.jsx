import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { handleUnAuthorized } from "./hooks/handleUnAuthorized";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../token";

const columns = [
    { id: "customer_name", label: "Name", minWidth: 130 },
    { id: "customer_mobile", label: "Mobile", minWidth: 130 },
    { id: "customer_email", label: "Email", minWidth: 130 },
    { id: "depositAmount", label: "Deposit", minWidth: 130, align: "right", format: (value) => value.toLocaleString("en-US") },
    { id: "oldAmount", label: "OldAmount", minWidth: 130, align: "right", format: (value) => value.toLocaleString("en-US") },
    { id: "ip", label: "IP Address", minWidth: 130 },
    { id: "client_txn_id", label: "Client Txn ID", minWidth: 130 },
    { id: "txn_id", label: "Transaction ID", minWidth: 130 },
    { id: "upi_txn_id", label: "UPI Transaction ID", minWidth: 130 },
    { id: "status", label: "Status", minWidth: 130 },
    { id: "createdAt", label: "Created At", minWidth: 130, format: (value) => {
        const createdAt = new Date(value);
        const formattedDate = createdAt.toLocaleDateString();
        const formattedTime = createdAt.toLocaleTimeString();
        return `${formattedDate} ${formattedTime}`;
    } 
},
    { id: "txnAt", label: "Transaction At", minWidth: 130, format: (value) => new Date(value).toLocaleString() },
    { id: "updatedAt", label: "Updated At", minWidth: 130, format: (value) => new Date(value).toLocaleString() }
  ];
  
export default function UpiGatewayDepositHistory() {
    const navigate = useNavigate()

  const [page, setPage] = React.useState(0);
  const [depositHistory, setDepositHistory] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalRows, setTotalRows] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchTransactionData = async (page, rowsPerPage) => {
      try {
          const accessToken = localStorage.getItem('access_token');
          const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
          
          const response = await axios.get(`${baseURL}upiGateway/deposit/history`, {
              headers: headers,
              params: { page, rowsPerPage }
          });

          if (response.status === 200) {
            console.log(response.data.transactions)
              setDepositHistory(response.data.transactions);
              setTotalRows(response.data.totalRows);
          }
      } catch (error) {
          console.log(error);
          handleUnAuthorized(error.response.data, navigate)
      }
  };

  React.useEffect(() => {
    fetchTransactionData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <div className="fade-in">
      <div
        style={{
          paddingLeft: "2rem",
          marginTop: "4rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid white",
        }}
      >
        <h3 style={{ color: "white" }}>Deposit Manager</h3>
      </div>

      <section style={{ marginTop: "2rem" }} className="content">
        <div className="container-fluid" style={{ marginTop: "-35px" }}>
          <div className="img-out"></div>
          <div className="row"></div>
          <Paper sx={{ width: "100%", overflow: "hidden",marginTop:"50px",background: '#a6a6ff',color:"#fff !important"  }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {depositHistory
                    ?.map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.client_txn_id || row._id}

                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[1,10, 25, 100]}
              component="div"
              count={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </section>
    </div>
  );
}
