import React, { useState, useEffect } from "react";

import axios from "axios";
import { baseURL } from "../token";
import Swal from "sweetalert2";

const Gateway = () => {
  const [RazorPayout, setRazorpayout] = useState(true);
  const [RazorDeposit, setRazorDeposit] = useState(true);
  const [RazorpayAuto, setRazorpayAuto] = useState(false);
  const [RazorPayKey, setRazorpayKey] = useState();
  const [RazorPaySecretKey, setRazorpaysecretKey] = useState();
  const [AccountName, setAccountName] = useState();
  const [decentroPayout, setdecentropayout] = useState(true);
  const [decentroDeposit, setdecentroDeposit] = useState(true);
  const [decentroAuto, setdecentroAuto] = useState(false);
  const [settingId, setSettingId] = useState("");


  useEffect(() => {
    const data = axios.get(baseURL + "gatewaysettings/data", {}).then((res) => {
      console.log(res.data);
      setSettingId((res.data._id)?res.data._id:'');
      setRazorpayout(res.data.RazorPayout);
      setRazorDeposit(res.data.RazorDeposit);
      setRazorpayAuto(res.data.RazorpayAuto);
      setdecentropayout(res.data.decentroPayout);
      setdecentroDeposit(res.data.decentroDeposit);
      setdecentroAuto(res.data.decentroAuto);
      setRazorpayKey(res.data.RazorPayKey);
      setRazorpaysecretKey(res.data.RazorPaySecretKey);
      setAccountName(res.data.AccountName);
    });
  }, []);

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      baseURL + `gatewaysettings`,
      {
        settingId,
        RazorPayout,
        RazorDeposit,
        RazorpayAuto,
        decentroPayout,
        decentroDeposit,
        decentroAuto,
        RazorPayKey,
        RazorPaySecretKey,
        AccountName,
      }
    );
    console.log(response.data.status);
    if(response.data.status==='success'){
        Swal.fire({
            icon: "success",
            title: "Successfully",
            text: "Payment gateway updated successfully.",
        });
    }else{
      alert("Settings Not Submitted");
    }
  };

  return (
    <>
      <h4 className="text-uppercase font-weight-bold my-3">
        Payment Gateway Settings
      </h4>

      <h5 className="text-uppercase font-weight-bold my-3" >RazorPay</h5>

      <form
        action="gatewaysettings"
        className="form"
        onSubmit={handleSubmit1}
        method="patch"
        enctype="multipart/form-date"
        // style={{backgroundColor: 'whitesmoke'}}
      >
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="buttonrazpay" className="my-1 pt-1 pb-1" style={{ color: "black"}}>
              Razorpay Payout
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={RazorPayout}
              onChange={(e) => setRazorpayout(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>

            <label htmlFor="buttonrazdep" className="pb-1 pt-1 my-1" style={{ color: "black"}}>
            Razorpay Deposit
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={RazorDeposit}
              onChange={(e) => setRazorDeposit(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>

            <label htmlFor="buttonrazauto" className="pb-1 pt-1 my-1" style={{ color: "black"}}>
              RazorPay Auto
            </label>
            <select
              className="form-control"
              name=""
              id=""
              value={RazorpayAuto}
              onChange={(e) => setRazorpayAuto(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="RazorpayKey" style={{ color: "black"}}>RazorPay Key</label>
            <input
              className="form-control"
              type="text"
              value={RazorPayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
            />
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="RazorpaysecretKey" style={{ color: "black"}}>RazorPay SecretKey</label>
            <input
              className="form-control"
              type="text"
              value={RazorPaySecretKey}
              onChange={(e) => setRazorpaysecretKey(e.target.value)}
            />
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="AccountName" style={{ color: "black"}}>Account Name</label>
            <input
              className="form-control"
              type="text"
              value={AccountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
        </div>

        {/* <div className="form-row">
          <div className="form-group col-md-4">
            <h5 className="text-uppercase font-weight-bold my-3">Decentro</h5>

            <label htmlFor="buttondecpay" className="col-2 my-1">
              Decentro payout
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroPayout}
              onChange={(e) => setdecentropayout(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>

            <label htmlFor="buttondecdep" className="col-2 my-1">
              Decentro Deposit
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroDeposit}
              onChange={(e) => setdecentroDeposit(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>

            <label htmlFor="buttondecdep" className="col-2 my-1">
              Decentro Auto
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroAuto}
              onChange={(e) => setdecentroAuto(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
        </div> */}

        <div className="form-row">
          <div className="form-group col-md-4">
            <button type="submit" className="btn btn-dark">
              submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Gateway;
