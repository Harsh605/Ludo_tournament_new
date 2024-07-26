import React, { useEffect, useState, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { baseURL, token } from '../../token';
import axios from 'axios';
import HeaderComponent from '../HeaderComponent';
import acceptSound from "./accept.mp3";
import playSound from "./play.mp3";
import findGif from "../../styles/loading_old.gif";

// import Logo from '../styles/logo.jpg'

const Openbattles = React.memo(({ key, allgame, user, deleteChallenge, getPost, RejectGame, winnAmount, AcceptChallang, updateChallenge }) => {
    // const navigate = useNavigate();
    // const [messageError, setMessageError] = useState('');
    // const [commission, setCommision] = useState(0);
     const [isLoading, setIsLoading] = useState(false);

    // const handleplaybtn = async (id, price, roomcode, challengeid) => {
    //     setMessageError('');
    //     try {
    //         // navigate('/EnterFirstGame')
    //         setIsLoading(true);
    //         console.log(id);
    //         const requestbody = {
    //             challengeId: id
    //         }
    //         const accessToken = localStorage.getItem('access_token'); // Retrieve access token from localStorage
    //         // console.log(accessToken);
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    //         const response = await axios.post(baseURL + '/challenge/accept', requestbody, {
    //             headers: headers
    //         });
    //         fetchData();
    //         setMessageError('')
    //         console.log(response);
    //         setIsLoading(false);
    //         if (response) {
    //             <HeaderComponent />
    //             navigate('/EnterFirstGame', { state: { challengeruserid: challengeid, priceplay: price, roomcode: roomcode, type: "openbattle" } });
    //         }
    //     } catch (error) {
    //         setMessageError(error?.response?.data?.message);
    //         console.error("error:--", error?.response?.data?.message);
    //         setIsLoading(false);
    //     }
    // }
    // const handlecancelbtn = async (id) => {
    //     setMessageError('');
    //     try {
    //         console.log(id);
    //         setIsLoading(true);
    //         const accessToken = localStorage.getItem('access_token'); // Retrieve access token from localStorage
    //         // console.log(accessToken);
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    //         console.log(headers);
    //         const response = await axios.delete(`${baseURL}/challenge/${id}`, {
    //             headers: headers
    //         });
    //         fetchData();
    //         console.log(response);
    //         setIsLoading(false);
    //         // if (response) {
    //         //     navigate('EnterFirstGame')
    //         // }
    //     } catch (error) {
    //         setMessageError(error?.response?.data?.message);
    //         console.error("error:--", error);
    //         setIsLoading(false);
    //     }
    // }

    // const fetchpenalty = async () => {
    //     console.log("ahdfnjm");
    //     try {
    //         const accessToken = localStorage.getItem('access_token'); // Retrieve access token from localStorage
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    //         const response = await axios.get(baseURL + '/user/penalties', {
    //             headers: headers
    //         });
    //         console.log("responseee", response);
    //         console.log(response?.data?.data?.id, "response");
    //         setCommision(response?.data?.data?.commission);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    // useEffect(() => {
    //     fetchpenalty();
    // }, [])

    const [selectedMode, setSelectedMode] = useState("");

    useEffect(() => {
        // Get the gameMode from localStorage when the component mounts
        const savedGameMode = localStorage.getItem("gameMode") || "offSite";
        if (savedGameMode) {
            setSelectedMode(savedGameMode);
        }
        setIsLoading(false)
    },[ key, allgame, user, deleteChallenge, getPost, RejectGame, winnAmount, AcceptChallang, updateChallenge]);

    return (
        <div className="col-12 card my-1 walletcard pt-2 px-0 mx-auto text-white" key={key}>
            <div className="row">
                <div className="col d-flex justify-content-between " >
                    <span className="mx-2" style={{ fontSize: '15px', fontWeight: '600' }}>CHALLENGE FROM <span style={{ textTransform: "capitalize" }} className="text-danger">{allgame.Created_by.Name}</span></span>
                    {/* <h6 className="mx-2">{battle.roomcode}</h6> */}
                    {user == allgame.Created_by._id &&
                        allgame.Status == "new" && (
                            <button
                                style={{ width: '80px', height: '29px', fontSize: '11px' }}
                                // className={` p-1 m-1 mb-1 ml-auto btn-danger btn-sm`}
                                className={`btn bg-orange mr-2`}
                                onClick={() => (deleteChallenge(allgame._id), setIsLoading(true))}
                            >
                                {isLoading ? "Loading..." : "DELETE"} 
                            </button>
                        )}
                </div>
            </div>
            <div className="card-body walletbody mt-2">
                <div className="row">
                    {/* {isLoading && <p>Loading...</p>} */}
                    <div className="col-12 d-flex justify-content-between">
                        <div className="d-flex">
                            <div className="me-2">
                                <p className="mb-0" id="win-time">Entry Fee</p>
                                <h6 className="mb-0 d-flex"><span className="material-symbols-outlined text-success">payments</span> {allgame.Game_Ammount}</h6>
                            </div>
                            <div className="ms-2">
                                <p className="mb-0" id="win-time">Prize</p>
                                <h6 className="mb-0 d-flex"><span className="material-symbols-outlined text-success">payments</span>  {allgame.Game_Ammount +
                                    winnAmount(allgame.Game_Ammount)}</h6>
                            </div>
                        </div>

                        {user == allgame.Created_by._id &&
                            allgame.Status == "requested" && (<>
                                <div>
                                    <Link to={{ pathname: `/viewgame/${allgame._id}`, state: { prevPath: window.location.pathname } }} onClick={(e) => getPost(allgame._id)} style={{ bottom: '0' }}>
                                        <button
                                            style={{ width: '80px', height: '29px', fontSize: '11px', fontWeight: '600' }}
                                            className={`btn bg-orange ml-2 mt-2`}
                                        >
                                            START
                                        </button>
                                    </Link>
                                    {/* <button
                                    style={{width: '80px', height: '37px'}} className="btn bg-orange" onClick={() => handleplaybtn(battle.id, battle.price, battle.roomcode, battle.challenger)} disabled={isLoading} >Play</button> */}
                                    {/* <button className="btn bg-orange" onClick={handlePlaybtn}>Play</button> */}
                                </div>
                                <div>
                                    <button
                                        className={`btn bg-orange ml-2 mt-2`}
                                        style={{ width: '80px', height: '29px', fontSize: '11px', fontWeight: '600' }}
                                        onClick={() => (RejectGame(allgame._id), setIsLoading(true))}
                                    >
                                        {isLoading ? "Loading..." : "REJECT"}
                                    </button>
                                    {/* <button className="btn bg-orange" disabled={isLoading} onClick={() => handlecancelbtn(battle.id)} >Cancel</button> */}
                                    {/* <button className="btn bg-orange" onClick={handlePlaybtn}>Play</button> */}
                                </div>
                            </>)}

                        {user !== allgame.Created_by._id &&
                            allgame.Status == "new" && (
                                <button
                                    style={{ width: '80px', height: '37px' }}
                                    className={`btn bg-orange`}
                                    onClick={() => (AcceptChallang(allgame._id), setIsLoading(true))}
                                >
                                    {isLoading ? "Loading..." : "Play"} 
                                </button>
                            )}
                        {/* {user == allgame.Accepetd_By._id && allgame.Status == 'running' && <button
                        style={{width: '80px', height: '37px'}} className={`${css.bgSecondary} ${css.playButton} ${css.cxy}`} >start</button>} */}
                        {user == allgame.Created_by._id &&
                            allgame.Status == "new" && (
                                <div className="flex justify-center gap-7 items-center">
                                    <div className="text-center">
                                        <img
                                            src={findGif}
                                            style={{ width: "15px", height: "15px" }}
                                        />
                                    </div>
                                    <div style={{ lineHeight: 0 }}>
                                        <span className={''}>
                                            Finding Player!
                                        </span>
                                    </div>
                                </div>
                            )}
                        {user !== allgame.Created_by._id &&
                            allgame.Status == "requested" && (
                                <div className="d-flex ml-auto align-items-center">
                                    <div
                                        className={`btn bg-orange position-relative mx-1 text-white btn-sm`}
                                    >
                                        requested
                                    </div>
                                    <button
                                        style={{ width: '80px', height: '30px' }}
                                        className={`btn bg-orange position-relative mx-1 bg-danger btn-sm`}
                                        onClick={() => (RejectGame(allgame._id), setIsLoading(true))}
                                    >
                                        {isLoading ? "Loading..." : "cancel"}
                                    </button>
                                </div>
                            )}
                        {user !== allgame.Created_by._id &&
                            allgame.Status == "running" && (

                                <div className="d-flex ml-auto align-items-center">
                                    <audio src={playSound} autoPlay>
                                    </audio>
                                    <Link
                                        className={`btn bg-orange bg-success btn-sm'`}
                                        to={{ pathname: `/viewgame/${allgame._id}`, state: { prevPath: window.location.pathname } }}
                                        onClick={(e) => updateChallenge(allgame._id)}
                                    >
                                        
                                        {
                                                selectedMode === "offSite" ? "click for room code" : "Play game"
                                            }
                                        
                                    </Link>
                                </div>
                            )}
                        {user == allgame.Created_by._id &&
                            allgame.Status == "requested" && (
                                <div className="d-flex ml-auto align-items-center mr-5 mt-1">
                                    <audio src={acceptSound} autoPlay>
                                    </audio>

                                    {/* <div className="text-center" style={{width: '115px'}}> */}
                                        {/* <div className="pl-2"> */}
                                            {/* {allgame.Accepetd_By.avatar ? (<img
                                                src={baseURL + `${allgame.Accepetd_By.avatar}`}
                                                alt=""
                                                width='40px' height="40px"
                                                style={{ borderTopLeftRadius: "50%", borderTopRightRadius: "50%", borderBottomRightRadius: "50%", borderBottomLeftRadius: "50%" }}
                                            />) : null } */}
                                        {/* </div> */}
                                        {/* <div style={{ lineHeight: 1 }}> */}
                                            {/* <span className={''}>
                                                &nbsp;&nbsp;{allgame.Accepetd_By.Name.slice(0, 6)}
                                            </span> */}
                                        {/* </div> */}
                                    {/* </div> */}
                                </div>
                            )}

                    </div>
                </div>
            </div>
        </div>
    )
})

export default memo(Openbattles)
