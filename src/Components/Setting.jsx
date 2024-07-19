import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API requests
import "../Components/styles/Settings.css";
import { baseURL } from "../token";
import ReactSwitch from "react-switch";
import Gateway from "./Gateway";
import Swal from "sweetalert2";

const Settings = () => {
  const [WebTitle, setWebTitle] = useState("");
  const [WebsiteName, setWebName] = useState("");
  const [msg, setMsg] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const [CompanyAddress, setCompanyAddress] = useState("");
  const [CompanyMobile, setCompanyMobile] = useState("");
  const [CompanyEmail, setCompanyEmail] = useState("");
  const [CompanyWebsite, setCompanyWebsite] = useState("");
  const [referencePercentage, setReferencePercentage] = useState("");
  const [companyPercentage, setCompanyPercentage] = useState("");
  const [commissionSettingOne, setCommissionSettingOne] = useState("");
  const [commissionSettingTwo, setCommissionSettingTwo] = useState("");
  const [commissionSettingThree, setCommissionSettingThree] = useState("");
  const [commissionSettingFour, setCommissionSettingFour] = useState("");
  const [minimumGame, setMinimumGame] = useState("");
  const [maximumGame, setMaximumGame] = useState("");
  const [minimumWithdrawal, setMinimumWithdrawal] = useState("");
  const [maximumWithdrawal, setMaximumWithdrawal] = useState("");
  const [minimumDeposit, setMinimumDeposit] = useState("");
  const [maximumDeposit, setMaximumDeposit] = useState("");
  const [RoomCode, setRoomCode] = useState("");
  const [RoomCodeUrl, setRoomCodeUrl] = useState("");
  const [Logo, setLogo] = useState("");
  const [SmallLogo, setSmallLogo] = useState("");
  const [wrongUpdatePenalty, setWrongUpdatePenalty] = useState("");
  const [noUpdatePenalty, setNoUpdatePenalty] = useState("");
  const [withdrawTime, setWithdrawTime] = useState("");

  const [LandingImage1, setLandingImage1] = useState("");
  const [LandingImage2, setLandingImage2] = useState("");
  const [LandingImage3, setLandingImage3] = useState("");
  const [LandingImage4, setLandingImage4] = useState("");
  const [LandingImage5, setLandingImage5] = useState("");
  const [LandingImage6, setLandingImage6] = useState("");
  const [LandingImage7, setLandingImage7] = useState("");
  const [LandingImage8, setLandingImage8] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [upiId1, setUpiId1] = useState("");
  const [upiId2, setUpiId2] = useState("");
  const [upiId3, setUpiId3] = useState("");
  const [qrCode, setQrCode] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState("");

  const [isLandingImage1, issetLandingImage1] = useState(true);
  const [isLandingImage2, issetLandingImage2] = useState(true);
  const [isLandingImage3, issetLandingImage3] = useState(true);
  const [isLandingImage4, issetLandingImage4] = useState(true);
  const [isLandingImage5, issetLandingImage5] = useState(true);
  const [isLandingImage6, issetLandingImage6] = useState(true);
  const [isLandingImage7, issetLandingImage7] = useState(true);
  const [isLandingImage8, issetLandingImage8] = useState(true);
  const [checkedRoom, setCheckedRoom] = useState(true);

  const [upiGatewayKey, setUpiGatewayKey] = useState("");
  const [paymentGateway, setPaymentGateway] = useState(0);
  const [isOnSiteLudoPlay, setIsOnSiteLudoPlay] = useState(0);
  const [isOffSiteLudoPlay, setIsOffSiteLudoPlay] = useState(0);

  const [version, setVersion] = useState("");

  const [settingId, setSettingId] = useState("");

  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  useEffect(() => {
    const data = axios.get(baseURL + "settings/data", {}).then((res) => {
      console.log(res.data);
      setSettingId(res.data._id ? res.data._id : "");
      setWebTitle(res.data.WebTitle);
      setCheckedRoom(res.data.roomcodeAuto);
      setWebName(res.data.WebsiteName);
      setMsg(res.data.msg);
      setCompanyName(res.data.CompanyName);
      setCompanyAddress(res.data.CompanyAddress);
      setCompanyMobile(res.data.CompanyMobile);
      setCompanyEmail(res.data.CompanyEmail);
      setCompanyWebsite(res.data.CompanyWebsite);
      setCompanyPercentage(res?.data?.CompanyPercentage);
      setMinimumGame(res?.data?.minimumGame);
      setMaximumGame(res?.data?.maximumGame);
      setMinimumWithdrawal(res?.data?.minimumWithdrawal);
      setMaximumWithdrawal(res?.data?.maximumWithdrawal);
      setMinimumDeposit(res?.data?.minimumDeposit);
      setMaximumDeposit(res?.data?.maximumDeposit);
      setUpiGatewayKey(res?.data?.upiGatewayKey);
      setPaymentGateway(res?.data?.paymentGateway);
      setIsOnSiteLudoPlay(res?.data?.isOnSiteLudoPlay);
      setIsOffSiteLudoPlay(res?.data?.isOffSiteLudoPlay);
      setCommissionSettingOne(res?.data?.commissionSettingOne);
      setCommissionSettingTwo(res?.data?.commissionSettingTwo);
      setCommissionSettingThree(res?.data?.commissionSettingThree);
      setCommissionSettingFour(res?.data?.commissionSettingFour);
      setWrongUpdatePenalty(res?.data?.wrongUpdatePenalty);
      setNoUpdatePenalty(res?.data?.noUpdatePenalty);
      setWithdrawTime(res?.data?.withdrawTime);
      setUpiId1(res?.data?.upiId1);
      setUpiId2(res?.data?.upiId2);
      setUpiId3(res?.data?.upiId3);
      setQrCodeImage(res.data.qrCodeImage);
      setQrCode(res.data.qrCode);
      setReferencePercentage(res?.data?.ReferencePercentage);
      setRoomCode(res.data.roomcodeUrl);
      setRoomCodeUrl(res.data.roomcodeUrlPopular);
      setLogo(res.data.Logo);
      setSmallLogo(res.data.SmallLogo);
      setLandingImage1(res.data.LandingImage1);
      setLandingImage2(res.data.LandingImage2);
      setLandingImage3(res.data.LandingImage3);
      setLandingImage4(res.data.LandingImage4);
      setLandingImage1(res.data.LandingImage5);
      setLandingImage2(res.data.LandingImage6);
      setLandingImage3(res.data.LandingImage7);
      setLandingImage4(res.data.LandingImage8);
      issetLandingImage1(res.data.isLandingImage1);
      issetLandingImage2(res.data.isLandingImage2);
      issetLandingImage3(res.data.isLandingImage3);
      issetLandingImage4(res.data.isLandingImage4);
      issetLandingImage5(res.data.isLandingImage5);
      issetLandingImage6(res.data.isLandingImage6);
      issetLandingImage7(res.data.isLandingImage7);
      issetLandingImage8(res.data.isLandingImage8);
      setVersion(res.data.version);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("settingId", settingId);
    formData.append("WebTitle", WebTitle);
    formData.append("WebsiteName", WebsiteName);
    formData.append("msg", msg);
    formData.append("CompanyName", CompanyName);
    formData.append("CompanyAddress", CompanyAddress);
    formData.append("CompanyMobile", CompanyMobile);
    formData.append("CompanyEmail", CompanyEmail);
    formData.append("CompanyWebsite", CompanyWebsite);
    formData.append("CompanyPercentage", companyPercentage);
    formData.append("ReferencePercentage", referencePercentage);
    formData.append("telegramLink", telegramLink);
    formData.append("commissionSettingOne", commissionSettingOne);
    formData.append("commissionSettingTwo", commissionSettingTwo);
    formData.append("commissionSettingThree", commissionSettingThree);
    formData.append("commissionSettingFour", commissionSettingFour);
    formData.append("minimumGame", minimumGame);
    formData.append("maximumGame", maximumGame);
    formData.append("minimumWithdrawal", minimumWithdrawal);
    formData.append("maximumWithdrawal", maximumWithdrawal);
    formData.append("minimumDeposit", minimumDeposit);
    formData.append("maximumDeposit", maximumDeposit);
    formData.append("upiGatewayKey", upiGatewayKey);
    formData.append("paymentGateway", paymentGateway);
    formData.append("isOnSiteLudoPlay", isOnSiteLudoPlay);
    formData.append("isOffSiteLudoPlay", isOffSiteLudoPlay);
    formData.append("wrongUpdatePenalty", wrongUpdatePenalty);
    formData.append("noUpdatePenalty", noUpdatePenalty);
    formData.append("withdrawTime", withdrawTime);
    formData.append("upiId1", upiId1);
    formData.append("upiId2", upiId2);
    formData.append("upiId3", upiId3);
    formData.append("qrCodeImage", qrCodeImage);
    formData.append("qrCode", qrCode);
    formData.append("roomcodeUrl", RoomCode);
    formData.append("roomcodeUrlPopular", RoomCodeUrl);
    formData.append("roomcodeAuto", checkedRoom);
    formData.append("Logo", Logo);
    formData.append("SmallLogo", SmallLogo);
    formData.append("LandingImage1", LandingImage1);
    formData.append("LandingImage2", LandingImage2);
    formData.append("LandingImage3", LandingImage3);
    formData.append("LandingImage4", LandingImage4);
    formData.append("LandingImage5", LandingImage5);
    formData.append("LandingImage6", LandingImage6);
    formData.append("LandingImage7", LandingImage7);
    formData.append("LandingImage8", LandingImage8);
    formData.append("isLandingImage1", isLandingImage1);
    formData.append("isLandingImage2", isLandingImage2);
    formData.append("isLandingImage3", isLandingImage3);
    formData.append("isLandingImage4", isLandingImage4);
    formData.append("isLandingImage5", isLandingImage5);
    formData.append("isLandingImage6", isLandingImage6);
    formData.append("isLandingImage7", isLandingImage7);
    formData.append("isLandingImage8", isLandingImage8);
    formData.append("version", version);
    const response = await axios.post(baseURL + `settings`, formData);
    console.log(response.data);
    if (response.data.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Successfully",
        text: "Setting updated successfully.",
      });
    } else {
      alert("Settings Not Submitted");
    }
  };

  useEffect(() => {
    const Logo1 = document.getElementById("Logo");
    const Logo2 = document.getElementById("SmallLogo");
    const LandingImage1 = document.getElementById("LandingImage1");
    const LandingImage2 = document.getElementById("LandingImage2");
    const LandingImage3 = document.getElementById("LandingImage3");
    const LandingImage4 = document.getElementById("LandingImage4");
    const LandingImage5 = document.getElementById("LandingImage5");
    const LandingImage6 = document.getElementById("LandingImage6");
    const LandingImage7 = document.getElementById("LandingImage7");
    const LandingImage8 = document.getElementById("LandingImage8");
    const QrCodeImage = document.getElementById("QrCodeImage");

    Logo1.onchange = (e) => {
      const [file] = Logo1.files;
      setLogo(file);
    };
    Logo2.onchange = (e) => {
      const [file] = Logo2.files;
      setSmallLogo(file);
    };
    LandingImage1.onchange = (e) => {
      const [file] = LandingImage1.files;
      setLandingImage1(file);
    };
    LandingImage2.onchange = (e) => {
      const [file] = LandingImage2.files;
      setLandingImage2(file);
    };
    LandingImage3.onchange = (e) => {
      const [file] = LandingImage3.files;
      setLandingImage3(file);
    };
    LandingImage4.onchange = (e) => {
      const [file] = LandingImage4.files;
      setLandingImage4(file);
    };
    LandingImage5.onchange = (e) => {
      const [file] = LandingImage5.files;
      setLandingImage5(file);
    };
    LandingImage6.onchange = (e) => {
      const [file] = LandingImage6.files;
      setLandingImage6(file);
    };
    LandingImage7.onchange = (e) => {
      const [file] = LandingImage7.files;
      setLandingImage7(file);
    };
    LandingImage8.onchange = (e) => {
      const [file] = LandingImage8.files;
      setLandingImage8(file);
    };
    QrCodeImage.onchange = (e) => {
      const [file] = QrCodeImage.files;
      setQrCodeImage(file);
    };
  }, []);

  const handleChangeRoom = (val) => {
    setCheckedRoom(val);
  };

  return (
    <>
      <div className="fade-in">
        <div
          style={{
            paddingLeft: "2rem",
            marginTop: "4rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid white",
          }}
        >
          <h3 style={{ color: "white" }}>Settings</h3>
        </div>

        <div style={{ marginTop: "5rem" }}>
          <div className="container">
            <div className="row gutters">
              <div className="">
                <div className="card h-100">
                  <div style={{ background: "#a6a6ff" }} className="card-body">
                    {/* <h3 className="text-uppercase font-weight-bold my-3">Website Settings</h3>

                                        <h4 className="text-uppercase font-weight-bold my-3" >UI Settings</h4> */}
                    <form
                      onSubmit={handleSubmit}
                      method="patch"
                      encType="multipart/form-data"
                      // style={{ backgroundColor: "whitesmoke" }}
                    >
                        
                    <div style={{fontSize:"22px",color:"#00f",marginBottom:"15px"}}>Website Basic Settings</div>
                      <div className="form-row">
                      <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Website Title
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={WebTitle}
                            onChange={(e) => setWebTitle(e.target.value)}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Website Name
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={WebsiteName}
                            onChange={(e) => setWebName(e.target.value)}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Company Name
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={CompanyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Commpany Address
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={CompanyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Commpany Mobile
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={CompanyMobile}
                            onChange={(e) => setCompanyMobile(e.target.value)}
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteEmail"
                            style={{ color: "black" }}
                          >
                            Commpany Email
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={CompanyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Commpany Website
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={CompanyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            placeholder="Enter Company Website"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Message
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Msg"
                          />
                        </div>
                        
                        {/* <div className="form-group col-md-4">
                                                    <label htmlFor="WebsiteWebsite" style={{ color: "black" }}>Game Commission</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        value={companyPercentage}
                                                        onChange={(e) => setCompanyPercentage(e.target.value)}
                                                        placeholder="Enter Commission"
                                                    />
                                                </div> */}
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Telegram Link
                          </label>
                          <input
                            className="form-control"
                            type="url"
                            value={telegramLink}
                            onChange={(e) => setTelegramLink(e.target.value)}
                            placeholder="Enter Telegram Link"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            version
                          </label>

                          <input
                            className="form-control"
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Right Logo
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="Logo"
                            id="Logo"
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Left Logo
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="SmallLogo"
                            id="SmallLogo"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Game image (1){" "}
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="LandingImage1"
                            id="LandingImage1"
                          />
                          <select
                            className="form-control"
                            name=""
                            id=""
                            value={isLandingImage1}
                            onChange={(e) => issetLandingImage1(e.target.value)}
                          >
                            <option value="true">on</option>
                            <option value="false">off</option>
                          </select>
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Game image (2)
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="LandingImage2"
                            id="LandingImage2"
                          />
                          <select
                            className="form-control"
                            name=""
                            id=""
                            value={isLandingImage2}
                            onChange={(e) => issetLandingImage2(e.target.value)}
                          >
                            <option value="true">on</option>
                            <option value="false">off</option>
                          </select>
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Game image (3)
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="LandingImage3"
                            id="LandingImage3"
                          />
                          <select
                            className="form-control"
                            name=""
                            id=""
                            value={isLandingImage3}
                            onChange={(e) => issetLandingImage3(e.target.value)}
                          >
                            <option value="true">on</option>
                            <option value="false">off</option>
                          </select>
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Game image (4)
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="LandingImage4"
                            id="LandingImage4"
                          />
                          <select
                            className="form-control"
                            name=""
                            id=""
                            value={isLandingImage4}
                            onChange={(e) => issetLandingImage4(e.target.value)}
                          >
                            <option value="true">on</option>
                            <option value="false">off</option>
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="qrCode"
                            style={{ display: "block", color: "black" }}
                          >
                            Switch Ludo king play
                          </label>
                          <ReactSwitch
                            checked={isOffSiteLudoPlay}
                            onChange={(e) =>
                              setIsOffSiteLudoPlay(isOffSiteLudoPlay == 0 ? 1 : 0)
                            }
                            style={{ display: "none" }}
                          />
                        </div>
                        
                      </div>

                      <div style={{fontSize:"22px",color:"#00f",marginBottom:"15px"}}>Live ludo play image</div>
                      <div className="form-row">
                      <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Game image (1)
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="LandingImage5"
                            id="LandingImage5"
                          />
                          <select
                            className="form-control"
                            name=""
                            id=""
                            value={isLandingImage5}
                            onChange={(e) => issetLandingImage5(e.target.value)}
                          >
                            <option value="true">on</option>
                            <option value="false">off</option>
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Game image (2)
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="LandingImage6"
                            id="LandingImage6"
                          />
                          <select
                            className="form-control"
                            name=""
                            id=""
                            value={isLandingImage6}
                            onChange={(e) => issetLandingImage6(e.target.value)}
                          >
                            <option value="true">on</option>
                            <option value="false">off</option>
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Game image (3)
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="LandingImage7"
                            id="LandingImage7"
                          />
                          <select
                            className="form-control"
                            name=""
                            id=""
                            value={isLandingImage7}
                            onChange={(e) => issetLandingImage7(e.target.value)}
                          >
                            <option value="true">on</option>
                            <option value="false">off</option>
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteName"
                            style={{ color: "black" }}
                          >
                            Game image (4)
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="LandingImage8"
                            id="LandingImage8"
                          />
                          <select
                            className="form-control"
                            name=""
                            id=""
                            value={isLandingImage8}
                            onChange={(e) => issetLandingImage8(e.target.value)}
                          >
                            <option value="true">on</option>
                            <option value="false">off</option>
                          </select>
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="qrCode"
                            style={{ display: "block", color: "black" }}
                          >
                            Switch Live Ludo play
                          </label>
                          <ReactSwitch
                            checked={isOnSiteLudoPlay}
                            onChange={(e) =>
                              setIsOnSiteLudoPlay(isOnSiteLudoPlay == 0 ? 1 : 0)
                            }
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>

                      <div style={{fontSize:"22px",color:"#00f",marginBottom:"15px",marginTop:"10px"}}>Manual and Upi Payment Gateway Settings</div>
                      <div className="form-row">
                      <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            UPI Payment Gateway Key
                          </label>
                          <input
                            className="form-control"
                            // type="number"
                            value={upiGatewayKey}
                            onChange={(e) => setUpiGatewayKey(e.target.value)}
                            placeholder="UPI Payment Gateway Key"
                          />
                        </div>

                        <div className="form-group col-md-4">
                          <label
                            htmlFor="qrCode"
                            style={{ display: "block", color: "black" }}
                          >
                            Switch Gateway
                          </label>
                          <ReactSwitch
                            checked={paymentGateway}
                            onChange={(e) =>
                              setPaymentGateway(paymentGateway == 0 ? 1 : 0)
                            }
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>

                      <div style={{fontSize:"22px",color:"#00f",marginBottom:"15px",marginTop:"10px"}}>Main Payment Settings</div>

                      <div className="form-row">
                      <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Referral Commission
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={referencePercentage}
                            onChange={(e) =>
                              setReferencePercentage(e.target.value)
                            }
                            placeholder="Enter Referral Commission"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Wrong Update Penalty
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={wrongUpdatePenalty}
                            onChange={(e) =>
                              setWrongUpdatePenalty(e.target.value)
                            }
                            placeholder="Enter Wrong Update Penalty"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            No Update Penalty
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={noUpdatePenalty}
                            onChange={(e) => setNoUpdatePenalty(e.target.value)}
                            placeholder="Enter No Update Penalty"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Withdraw Time(In hours)
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={withdrawTime}
                            onChange={(e) => setWithdrawTime(e.target.value)}
                            placeholder="Enter Withdraw Time"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Commission (0-100)
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={commissionSettingOne}
                            onChange={(e) =>
                              setCommissionSettingOne(e.target.value)
                            }
                            placeholder="Commission (0-100)"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Commission (101-200)
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={commissionSettingTwo}
                            onChange={(e) =>
                              setCommissionSettingTwo(e.target.value)
                            }
                            placeholder="Commission (101-200)"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Commission (201-500)
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={commissionSettingThree}
                            onChange={(e) =>
                              setCommissionSettingThree(e.target.value)
                            }
                            placeholder="Commission(201-500)"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Commission (500-10000)
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={commissionSettingFour}
                            onChange={(e) =>
                              setCommissionSettingFour(e.target.value)
                            }
                            placeholder="Commission(500-10000)"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Minimum Game
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={minimumGame}
                            onChange={(e) => setMinimumGame(e.target.value)}
                            placeholder="Minimum Game"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Maximum Game
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={maximumGame}
                            onChange={(e) => setMaximumGame(e.target.value)}
                            placeholder="Maximum Game"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Minimum Withdrawal
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={minimumWithdrawal}
                            onChange={(e) =>
                              setMinimumWithdrawal(e.target.value)
                            }
                            placeholder="Minimum Withdrawal"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Maximum Withdrawal
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={maximumWithdrawal}
                            onChange={(e) =>
                              setMaximumWithdrawal(e.target.value)
                            }
                            placeholder="Maximum Withdrawal"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Minimum Deposit
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={minimumDeposit}
                            onChange={(e) => setMinimumDeposit(e.target.value)}
                            placeholder="Minimum Deposit"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Maximum Deposit
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            value={maximumDeposit}
                            onChange={(e) => setMaximumDeposit(e.target.value)}
                            placeholder="Maximum Deposit"
                          />
                        </div>
                        
                      </div>


                      <div className="form-row">
                        
                      </div>

                      
                      <div className="form-row">
                        
                        <div className="form-group col-md-5">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            Classic Room Code Url
                          </label>
                          <input
                            className="form-control"
                            type="url"
                            value={RoomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            placeholder="Enter Url"
                          />
                        </div>
                        <div className="form-group col-md-5">
                          <label
                            htmlFor="WebsiteWebsite"
                            style={{ color: "black" }}
                          >
                            {" "}
                            Popular Room Code Url{" "}
                          </label>
                          <input
                            className="form-control"
                            type="url"
                            value={RoomCodeUrl}
                            onChange={(e) => setRoomCodeUrl(e.target.value)}
                            placeholder="Enter Url"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label
                            htmlFor="autoroomcode"
                            style={{ display: "block", color: "black" }}
                          >
                            Auto roomcode
                          </label>
                          {/* <input id="autoroomcode"
        className="form-control"
        type="checkbox"
        value={RoomCode}
        style={{width:'20px'}}
        onChange={(e) => setRoomCode(e.target.value)}
  
      /> */}
                          <ReactSwitch
                            checked={checkedRoom}
                            onChange={handleChangeRoom}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <button type="submit" className="btn btn-dark">
                            submit
                          </button>
                        </div>
                      </div>
                    </form>
                    {/* <h4 className="text-uppercase font-weight-bold my-3">
                                            UPI Settings
                                        </h4> */}
                    {/* <Gateway /> */}
                    {/* <h5 className="text-uppercase font-weight-bold my-3" >RazorPay</h5> */}

                    <div style={{fontSize:"22px",color:"#00f",marginBottom:"15px",marginTop:"10px"}}>Manual Qr Code Settings</div>

                    <form
                      action="gatewaysettings"
                      className="form"
                      onSubmit={handleSubmit}
                      method="patch"
                      enctype="multipart/form-date"
                      style={{ background: "#a6a6ff" }}
                    >
                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="RazorpaysecretKey"
                            style={{ color: "black" }}
                          >
                            UPI ID 1
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Upi Id"
                            value={upiId1}
                            onChange={(e) => setUpiId1(e.target.value)}
                          />
                          
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="RazorpayKey"
                            style={{ color: "black" }}
                          >
                            UPI ID 2
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Upi Id"
                            value={upiId2}
                            onChange={(e) => setUpiId2(e.target.value)}
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label
                            htmlFor="RazorpayKey"
                            style={{ color: "black" }}
                          >
                            UPI ID 3
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Upi Id"
                            value={upiId3}
                            onChange={(e) => setUpiId3(e.target.value)}
                          />
                        </div>
                      </div>

                      
                      <div className="form-row">
                      <div
                          className="form-group col-md-4"
                          style={{ display: qrCode ? "block" : "none" }}
                        >
                          <label
                            htmlFor="QrCodeImage"
                            style={{ color: "black" }}
                          >
                            Qr Code Image
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="QrCodeImage"
                            id="QrCodeImage"
                          />
                        </div>
                        <div className="form-group col-md-2">
                          <label
                            htmlFor="qrCode"
                            style={{ display: "block", color: "black" }}
                          >
                            QrCode Show
                          </label>
                          <ReactSwitch
                            checked={qrCode}
                            onChange={(e) => setQrCode(e)}
                            style={{ display: "none" }}
                          />
                        </div>
                        
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <button type="submit" className="btn btn-dark">
                            submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
