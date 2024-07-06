import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { generateTransactionId } from "../Utils/UtilsFunc";
import axios from "axios";
import { baseURL } from "../../token";

const UpiPaymentGateway = ({ userData, setting }) => {
  const [depositAmount, setDepositAmount] = useState("");

  const location = useLocation();
  const [message, setMessage] = useState();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setMessage(errorParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (
      message ===
      "Transaction Successful, Amount Has been added to your account!..."
    ) {
      console.log(message);
    } else {
      console.error(message);
    }
  }, [message]);

  console.log(userData.Wallet_balance);
  const handlePayClick = async (data) => {
    if (depositAmount < setting?.minimumDeposit) {
      console.error(`Minimum deposit amount is ${setting?.minimumDeposit}`);
      return;
    }
    if (depositAmount > setting?.maximumDeposit) {
      console.error(`Maximum Deposit is ${setting?.maximumDeposit}`);
      return;
    }
    const depositData = {
      key: setting?.upiGatewayKey,
      p_info: setting?.WebsiteName,
      customer_mobile: String(userData?.Phone),
      customer_email: userData?.Email,
      customer_name: userData?.Name,
      amount: depositAmount,
      client_txn_id: generateTransactionId(userData?.Phone),
      udf1: userData?._id,
      udf2: String(userData?.Wallet_balance),
      //   redirect_url: `${baseURL}/getUpiGatewayPaymentDetails`,
      redirect_url: `https://backend.khelludokhel.info/getUpiGatewayPaymentDetails`,
    };

    try {
      const access_token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const response = await axios.post(
        `${baseURL}/upiGatewayDoPayment`,
        depositData,
        { headers } // Pass headers here
      );

      console.log(response.data);
      if (response.data.status) {
        console.log(response.data);
        window.open(response.data.data.payment_url);
      } else {
        console.error(response.data.message || "Payment creation failed");
      }
    } catch (error) {
      if (error?.response?.data) {
        console.error(error.response.data.message);
      } else {
        console.error("An error occurred:", error.message);
      }
    }
  };

  return (
    <div>
      <div className="col-12 my-3">
        <label htmlFor="username" className="text-left text-yellow">
          Enter Amount
        </label>
      </div>
      <div className="col-12 mb-4 d-flex justify-content-center">
        <button id="buy-chips-btn" className="text-light">
          <i className="bi bi-currency-rupee" />
        </button>
        <input
          id="buy-chips-input"
          className="text-yellow"
          type="text"
          onChange={(e) => setDepositAmount(e.target.value)}
          value={depositAmount}
        />
      </div>
      <div className="col-12">
        <a>
          <p>{message}</p>
          <button className="bg-orange btn" onClick={handlePayClick}>
            Pay
          </button>
        </a>
      </div>
    </div>
  );
};

export default UpiPaymentGateway;
