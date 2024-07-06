import React, { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { baseURL, token } from "../token";
import axios from "axios";
import Logo from "./Logo";
import { TablePagination } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function UpiGatewayHistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [depositHistory, setDepositHistory] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [userData,setUserData] = useState({})

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchTransactionData = async (page, rowsPerPage) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const response = await axios.get(
        `${baseURL}/upiGateway/deposit/myHistory`,
        {
          headers: headers,
          params: { page, rowsPerPage },
        }
      );

      if (response.status === 200) {
        console.log(response.data.transactions);
        setDepositHistory(response.data.transactions);
        setTotalRows(response.data.totalRows);
      }
    } catch (error) {
      console.log(error);
      //   handleUnAuthorized(error.response.data, navigate);
    }
  };
  const MyData = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const responsedetails = await axios.get(baseURL + "/me", {
        headers: headers,
      });
      setUserData(responsedetails.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTransactionData(page, rowsPerPage);
  }, [page, rowsPerPage]);
  useEffect(() => {
    MyData();
  }, []);

  return (
    <>
      <section id="main-bg">
        <div id="challengeset-container" className="container mx-0">
          <div className="row">
            <div className="col-12">
              <HeaderComponent userData={userData} />
            </div>
          </div>
          <div className="row mt-4" id="all">
            <div className="col-12">
              <div style={{ overflowX: "auto" }}>
                <table className="table table-bordered" style={{ minWidth: "1200px" }}>
                  <thead >
                    <tr style={{border:"1px solid #7858a6"}}>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>Name</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>Mobile</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>Email</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>DepositAmt</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>OldAmt</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>IpAddress</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>ClientTxnId</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>TransactionId</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>UpiTxnId</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",color:"#fff",fontWeight:"400"}}>Status</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",minWidth:"170px",color:"#fff"}} >CreatedAt</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",minWidth:"170px",color:"#fff"}} >TxnAt</th>
                      <th scope="col" style={{backgroundColor:"#7858a6",minWidth:"170px",color:"#fff"}} >Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depositHistory?.map((item) => (
                      <tr key={item?._id}>
                        <td>{item?.customer_name}</td>
                        <td>{item?.customer_mobile}</td>
                        <td>{item?.customer_email}</td>
                        <td>{item?.depositAmount}</td>
                        <td>{item?.oldAmount}</td>
                        <td>{item?.ip}</td>
                        <td>{item?.client_txn_id}</td>
                        <td>{item?.txn_id}</td>
                        <td>{item?.upi_txn_id}</td>
                        <td>{item?.status}</td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                        <td>{new Date(item.txnAt).toLocaleString()}</td>
                        <td>{new Date(item.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <TablePagination
            rowsPerPageOptions={[1,10, 25, 50]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{backgroundColor:"#7858a6"}}
          />
        </div>
        <div
          className="rightContainer"
          style={{ position: "fixed", top: 0, bottom: 0, left: 900, zIndex: 5 }}
        >
          <div className="rcBanner flex-center">
            <Logo />
          </div>
        </div>
      </section>
    </>
  );
}

export default UpiGatewayHistoryPage;
