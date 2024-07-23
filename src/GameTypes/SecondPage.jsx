import React, { useState, useEffect } from 'react'
import HeaderComponent from '../Components/HeaderComponent';
import { useNavigate, useLocation } from 'react-router-dom';
// import token from '../token';
import { baseURL, socketURL, token } from '../token';
import axios from 'axios';
import "../styles/bootstrap.css"
import Openbattles from '../Components/Battles/openbattles';
import Runningbattles from '../Components/Battles/runningbattles';
import CreateBattles from '../Components/Battles/CreateBattles';
import Logo from '../Components/Logo';
import MyBattles from '../Components/Battles/MyBattles';
import Swal from 'sweetalert2';
import { useRef } from 'react';
import { handleUnAuthorized } from '../Components/hooks/handleUnAuthorized'


function SecondPage({ walletUpdate }) {
    let userID = useRef();
    const isMounted = useRef(true);

    const navigate = useNavigate()

    const [user, setUser] = useState();
    const [created, setCreated] = useState([]);
    const [socket, setSocket] = useState();

    const [userAllData, setUserAllData] = useState({})

    const role = async () => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        await axios.get(baseURL + `/me`, { headers }).then((res) => {
            setUser(res.data._id);
            setUserAllData(res.data)
            userID.current = res.data._id;
            setMount(true);
        })
            .catch(e => {
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
                if (e.response.status === 400 || e.response.status === 429) {
                    Swal.fire({
                        title: 'Please refresh!',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
            })
    };

    /// user details end

    const [game_type, setGame_type] = useState(
        useLocation().pathname.split("/")[2].replaceAll('%20', ' ')
    );
    // const [game_type, setGame_type] = useState("Ludo Classics");
    const [Game_Ammount, setGame_Ammount] = useState();
    const [isloading , setLoading] = useState(false)

    //   console.log(game_type);

    const ChallengeCreate = (e) => {
        setLoading(true)
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        axios
            .post(
                baseURL + `/challange/create`,
                {
                    Game_Ammount,
                    Game_type: game_type,
                },
                { headers }
            )
            .then((res) => {
                setLoading(false)
                setGame_Ammount('')
                if (res.data.msg === 'you can not create same amount challenge.') {
                    Swal.fire({
                        title: 'you can not create same amount challenge.',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
                else if (res.data.msg === "you have already enrolled") {
                    Swal.fire({
                        title: "You have already enrolled",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                } else if (res.data.msg === "You can set maximum 2 battle.") {
                    Swal.fire({
                        title: "You can set maximum 2 battle.",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
                else if (res.data.msg === "Insufficient balance") {
                    Swal.fire({
                        title: "Insufficient balance",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
                else if (
                    res.data.msg ===
                    "Game amount should be Greater then 50 and less then 10000"
                ) {
                    Swal.fire({
                        title: "Game amount should be Greater then 50 and less then 10000",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
                else if (
                    res.data.msg ===
                    "Set Battle in denomination of 50"
                ) {
                    Swal.fire({
                        title: "Set Battle in denomination of 50",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
                else if (
                    res.data.msg ===
                    "Technical Issue, Try after an hour!"
                ) {
                    Swal.fire({
                        title: "Technical Issue, Try after an hour!",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
                else if (
                    res.data.msg ===
                    "You can set maximum 1 battle."
                ) {
                    Swal.fire({
                        title: "You can set maximum 1 battle.",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                } if (
                    res.data.msg
                ) {
                    Swal.fire({
                        title: res.data.msg,
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                } else {
                    // Allgames();
                    socket.emit("gameCreated");

                }
            })
            .catch((e) => {
                setLoading(false)
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
                if (e?.response?.status === 400 || e?.response?.status === 429) {
                    Swal.fire({
                        title: 'Please refresh!',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }

            });
    };

    const [allgame, setallgame] = useState([]);
    const [mount, setMount] = useState(false);
    //const [ALL, setALL] = useState();
    const [runningGames, setRunningGames] = useState();
    const [ownRunning, setOwnRunning] = useState([]);
    const [settings, setSettings] = useState({});

    const settingData = async () => {
        const data = axios.get(baseURL + "/settings/data", {}).then((res) => {
            setSettings(res?.data);

        });
    }
    const Allgames = async () => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        axios
            .get(baseURL + `/challange/all`, { headers })
            .then((res) => {
                let owenedCreated = [], remainingGame = [];
                res.data.forEach(function (ele) {
                    if ((ele.Created_by._id === user) && (ele.Status === "new" || ele.Status === "requested")) {
                        owenedCreated.push(ele);
                    }
                    else {
                        remainingGame.push(ele);
                    }
                })
                setCreated(owenedCreated);
                setallgame(remainingGame);
            })
            .catch(e => {
                if (e.response?.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
                if (e.response?.status === 400 || e.response?.status === 429) {
                    Swal.fire({
                        title: 'Please refresh!',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
            })
    };

    const runningGame = async () => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        axios
            .get(baseURL + `/challange/running/all`, { headers })
            .then((res) => {
                let owenedRunning = [], remainingRunning = [];
                res.data.forEach(function (ele) {
                    if (ele.Created_by && ele.Accepetd_By)
                        if ((ele.Created_by._id === userID.current) || (ele.Accepetd_By._id === userID.current)) {
                            owenedRunning.push(ele);
                        }
                        else {
                            remainingRunning.push(ele);
                        }
                });
                setOwnRunning(owenedRunning);
                setRunningGames(remainingRunning);
            })
            .catch((e) => {

                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
                if (e.response.status === 400 || e.response.status === 429) {
                    Swal.fire({
                        title: 'Please refresh!',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
            })
    };

    function winnAmount(gameAmount) {
        let profit = null;
        if (gameAmount >= 0 && gameAmount <= 100)
            profit = gameAmount * settings?.commissionSettingOne / 100;
        else if (gameAmount > 101 && gameAmount <= 200)
            profit = gameAmount * settings?.commissionSettingTwo / 100;
        else if (gameAmount > 201 && gameAmount <= 500)
            profit = gameAmount * settings?.commissionSettingThree / 100;
        else if (gameAmount > 500)
            profit = gameAmount * settings?.commissionSettingFour / 100;
        return gameAmount - profit;
    }

    useEffect(() => {
        settingData()
        WebSocket.prototype.emit = function (event, data) {
            if (this.readyState === WebSocket.OPEN)
                this.send(JSON.stringify({ event, data }))
        }
        WebSocket.prototype.listen = function (eventName, callback) {
            this._socketListeners = this._socketListeners || {}
            this._socketListeners[eventName] = callback
        }
        // let socket = new WebSocket("wss://socket.ludo-khelo.com/server");
        let socket = new WebSocket(socketURL);
        function openFunc() {
            socket.onopen = () => {
                console.log('websocket is connected 👍');
                setSocket(socket);
                socket.pingTimeout = setTimeout(() => {
                    socket.close();
                    setSocket(undefined);
                }, 30000 + 1000);
            }
        }

        function listenFunc() {
            socket.onmessage = function (e) {
                try {
                    const { event, data } = JSON.parse(e.data)
                    socket._socketListeners[event](data);
                } catch (error) {
                    console.log(error);
                }
            }

            socket.listen('ping', (data) => {
                socket.emit('pong', 2)
                clearTimeout(socket.pingTimeout);
                socket.pingTimeout = setTimeout(() => {
                    console.log('ping terminate works 🏩');
                    socket.close();
                    setSocket(undefined);
                }, 30000 + 1000);
            })
            socket.listen("recieveGame", (data) => {
                console.log(data)
                let owenedCreated = [], remainingGame = [];
                if(selectedMode === "onSite"){

                    data.forEach(function (ele) {
                        if (ele.Created_by)
                            if ((ele.Created_by._id === userID.current) && (ele.Status === "new" || ele.Status === "requested") && (ele.Game_type === "Ludo Classics Live")) {
                                owenedCreated.push(ele);
                            }
                            else {
                                remainingGame.push(ele);
                            }
                    });

                }else{

                    data.forEach(function (ele) {
                        if (ele.Created_by)
                            if ((ele.Created_by._id === userID.current) && (ele.Status === "new" || ele.Status === "requested")) {
                                owenedCreated.push(ele);
                            }
                            else {
                                remainingGame.push(ele);
                            }
                    });

                }
                // console.log('own',owenedCreated,'remiain',remainingGame);
                setCreated(owenedCreated);
                setallgame(remainingGame);
            });

            socket.listen("updateRunning", (data) => {
                let owenedCreated = [], remainingGame = [];
                data.forEach(function (ele) {
                    if (ele.Created_by)
                        if ((ele.Created_by._id == userID.current) && (ele.Status == "new" || ele.Status == "requested")) {
                            owenedCreated.push(ele);
                        }
                        else {
                            remainingGame.push(ele);
                        }
                });
                setCreated(owenedCreated);
                setallgame(remainingGame);
                walletUpdate();
            });

            socket.listen("acceptor_seen", (data) => {
                let owenedCreated = [], remainingGame = [];
                data.openBattle.forEach(function (ele) {
                    if (ele.Created_by)
                        if ((ele.Created_by._id == userID.current) && (ele.Status == "new" || ele.Status == "requested")) {
                            owenedCreated.push(ele);
                        }
                        else {
                            remainingGame.push(ele);
                        }
                });
                setCreated(owenedCreated);
                setallgame(remainingGame);
                let owenedRunning = [], remainingRunning = [];
                data.runningBattle.forEach(function (ele) {
                    if (ele.Created_by && ele.Accepetd_By)
                        if ((ele.Created_by._id == userID.current) || (ele.Accepetd_By._id == userID.current)) {
                            owenedRunning.push(ele);
                        }
                        else {
                            remainingRunning.push(ele);
                        }
                });
                setOwnRunning(owenedRunning);
                setRunningGames(remainingRunning);
                walletUpdate();
            });

            socket.listen("resultUpdateReq", (data) => {
                let owenedRunning = [], remainingRunning = [];
                data.forEach(function (ele) {
                    if (ele.Created_by && ele.Accepetd_By)
                        if ((ele.Created_by._id == userID.current) || (ele.Accepetd_By._id == userID.current)) {
                            owenedRunning.push(ele);
                        }
                        else {
                            remainingRunning.push(ele);
                        }
                });
                setOwnRunning(owenedRunning);
                setRunningGames(remainingRunning);
                walletUpdate();
            });

            socket.listen("startAcepptor", (data) => {
                let owenedCreated = [], remainingGame = [];
                data.forEach(function (ele) {
                    if (ele.Created_by)
                        if ((ele.Created_by._id == userID.current) && (ele.Status == "new" || ele.Status == "requested")) {
                            owenedCreated.push(ele);
                        }
                        else {
                            remainingGame.push(ele);
                        }
                })
                setCreated(owenedCreated);
                setallgame(remainingGame);
                walletUpdate();
            });

            socket.listen("challengeAccepted", (data) => {
                let owenedCreated = [], remainingGame = [];
                data.forEach(function (ele) {
                    if (ele.Created_by)
                        if ((ele.Created_by._id == userID.current) && (ele.Status == "new" || ele.Status == "requested")) {
                            owenedCreated.push(ele);
                        }
                        else {
                            remainingGame.push(ele);
                        }
                })
                setCreated(owenedCreated);
                setallgame(remainingGame);
            });

            socket.listen("updateReject", (data) => {
                let owenedCreated = [], remainingGame = [];
                data.forEach(function (ele) {
                    if (ele.Created_by)
                        if ((ele.Created_by._id == userID.current) && (ele.Status == "new" || ele.Status == "requested")) {
                            owenedCreated.push(ele);
                        }
                        else {
                            remainingGame.push(ele);
                        }
                })
                setCreated(owenedCreated);
                setallgame(remainingGame);
            });

            socket.listen("ongoingChallenge", (data) => {
                let owenedCreated = [], remainingGame = [];
                if(selectedMode === "onSite"){
                    data.openBattle.forEach(function (ele) {
                        if (ele.Created_by)
                            if ((ele.Created_by._id == userID.current) && (ele.Status == "new" || ele.Status == "requested") && (ele.Game_type === "Ludo Classics Live")) {
                                owenedCreated.push(ele);
                            }
                            else {
                                remainingGame.push(ele);
                            }
                    });
                }else{
                    data.openBattle.forEach(function (ele) {
                    if (ele.Created_by)
                        if ((ele.Created_by._id == userID.current) && (ele.Status == "new" || ele.Status == "requested")) {
                            owenedCreated.push(ele);
                        }
                        else {
                            remainingGame.push(ele);
                        }
                });
                }
                
                setCreated(owenedCreated);
                setallgame(remainingGame);
                let owenedRunning = [], remainingRunning = [];
                if(selectedMode === "onSite"){
                    data.runningBattle.forEach(function (ele) {
                        if (ele.Created_by && ele.Accepetd_By && ele.Game_type === "Ludo Classics Live")
                            if ((ele.Created_by._id == userID.current) || (ele.Accepetd_By._id == userID.current)) {
                                owenedRunning.push(ele);
                            }
                            else {
                                remainingRunning.push(ele);
                            }
                    });
                }else{
                    data.runningBattle.forEach(function (ele) {
                        if (ele.Created_by && ele.Accepetd_By)
                            if ((ele.Created_by._id == userID.current) || (ele.Accepetd_By._id == userID.current)) {
                                owenedRunning.push(ele);
                            }
                            else {
                                remainingRunning.push(ele);
                            }
                    });
                }
               
                setOwnRunning(owenedRunning);
                setRunningGames(remainingRunning);
            });

            socket.listen("updateDelete", (data) => {
                let owenedCreated = [], remainingGame = [];
                data.forEach(function (ele) {
                    if (ele.Created_by)
                        if ((ele.Created_by._id == userID.current) && (ele.Status == "new" || ele.Status == "requested")) {
                            owenedCreated.push(ele);
                        }
                        else {
                            remainingGame.push(ele);
                        }
                })
                setCreated(owenedCreated);
                setallgame(remainingGame);
            });
        }
        function closeFunc() {
            socket.onclose = () => {
                console.log('socket disconnected wow 😡');
                if (isMounted.current) {
                    clearTimeout(socket.pingTimeout);
                    setSocket(undefined);
                    socket = new WebSocket(socketURL);
                    //socket = new WebSocket("ws://192.168.29.119:5001/server");
                    openFunc();
                    listenFunc();
                    closeFunc();
                }
            }
        }
        openFunc();
        listenFunc();
        closeFunc();

        return () => {
            isMounted.current = false;
            clearTimeout(socket.pingTimeout);
            setSocket(undefined);
            socket.close();
        }
    }, [])

    useEffect(() => {

        let access_token = localStorage.getItem('token');
        access_token = localStorage.getItem('token');
        if (!access_token) {
            // window.location.reload()
            setTimeout(() => {
                //  history.push("/login")
            }, 500);;
        }
        role();
        if (mount) {
            Allgames();
            runningGame();
        }

    }, [mount]);
    //accept Challange

    const AcceptChallang = (id) => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };
        axios
            .put(
                baseURL + `/challange/accept/${id}`,
                {
                    Accepetd_By: headers,
                    Acceptor_by_Creator_at: Date.now(),
                },
                {
                    headers,
                }
            )
            .then((res) => {
                if (res.data.msg === "you have already enrolled") {
                    Swal.fire({
                        title: "You have already enrolled",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
                if (res.data.msg === "Insufficient balance") {
                    Swal.fire({
                        title: "Insufficient balance",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                } else {
                    Allgames(res.data);
                    socket.emit("acceptGame");
                }
            })
            .catch((e) => {

                if (e.response.status == 401) {
                    // localStorage.removeItem('token');
                    // localStorage.removeItem('token');
                    // window.location.reload()
                    setTimeout(() => {
                        //  history.push("/login")
                    }, 500);
                }
                if (e.response.status == 400 || e.response.status == 429) {
                    Swal.fire({
                        title: 'Please refresh!',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
            });
    };

    //reject Game
    const RejectGame = (id) => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        axios
            .put(
                baseURL + `/challange/reject/${id}`,
                {
                    Accepetd_By: null,
                    Status: "new",
                    Acceptor_by_Creator_at: null,
                },
                { headers }
            )
            .then((res) => {

                socket.emit("gameRejected");
            })
            .catch((e) => {

                if (e.response.status == 401) {
                    // localStorage.removeItem('token');
                    // localStorage.removeItem('token');
                    // window.location.reload()
                    setTimeout(() => {
                        //  history.push("/login")
                    }, 500);
                }
                if (e.response.status == 400 || e.response.status == 429) {
                    Swal.fire({
                        title: 'Please refresh!',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
            });
    };

    //delete
    const deleteChallenge = (_id) => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        axios
            .delete(baseURL + `/challange/delete/${_id}`, { headers })
            .then((res) => {
                socket.emit("deleteGame", _id);
            })
            .catch((e) => {
                //console.log(e);
                if (e?.response?.status == 401) {
                    // localStorage.removeItem('token');
                    // localStorage.removeItem('token');
                    // window.location.reload()
                    setTimeout(() => {
                        //  history.push("/login")
                    }, 500);
                }
                if (e?.response?.status == 400 || e?.response?.status == 429) {
                    Swal.fire({
                        title: 'Please refresh!',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }
            });
    };

    ///challange/running/update/

    const updateChallenge = (_id) => {
        const access_token = localStorage.getItem("access_token");
        const headers = {
            Authorization: `Bearer ${access_token}`,
        };

        axios
            .put(
                baseURL + `/challange/running/update/${_id}`,
                {
                    Acceptor_seen: true,
                },
                { headers }
            )
            .then((res) => {
                socket.emit("game_seen");
            })
            .catch((e) => {
                if (e.response.status == 401) {
                    // localStorage.removeItem('token');
                    // localStorage.removeItem('token');
                    // window.location.reload()
                    setTimeout(() => {
                        //  history.push("/login")
                    }, 500);
                }
                if (e.response.status == 400 || e.response.status == 429) {
                    Swal.fire({
                        title: 'Please refresh!',
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                }

            });
    };

    // const [roomCode, setRoomCode] = useState()

    const getPost = async (Id) => {
        if (game_type === 'Ludo Classics' || game_type === 'Ludo 1 Goti' || game_type === 'Ludo Ulta' || game_type === "Ludo Snake" || game_type === "Ludo Classics Live") {
            socket.emit('roomCode', { game_id: Id, status: 'running' })

        }
        else if (game_type === 'Ludo Popular') {
            socket.emit('popularroomCode', { game_id: Id, status: 'running' })


        }
    }


    const [selectedMode, setSelectedMode] = useState("");

    useEffect(() => {
        // Get the gameMode from localStorage when the component mounts
        const savedGameMode = localStorage.getItem("gameMode") || "offSite";
        if (savedGameMode) {
            setSelectedMode(savedGameMode);
        }
    }, []);

    const handleChange = (e) => {
        const selectedMode = e.target.value;
        if (selectedMode === "onSite" || selectedMode === "offSite") {
            localStorage.setItem("gameMode", selectedMode);
            setSelectedMode(selectedMode);
            window.location.reload();
        }
    };

    return (
        <>
            <section id="main-bg">
                <div id="challengeset-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent userData={userAllData} />
                        </div>
                        <div className="col-12 my-3">
                            {/* <div className="row align-items-center my-2 px-2">
                                <div className="my-auto col-6 text-white">
                                    <h4>Games Mode</h4>
                                </div>
                                <div className="col-6 d-flex justify-content-end">
                                    <div className='row d-flex'>
                                        <select 
                                            name="" 
                                            className='form-control' 
                                            id="" 
                                            value={selectedMode}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select mode</option>
                                            <option value="onSite">On site play</option>
                                            <option value="offSite">Off site play</option>
                                        </select>
                                    </div>
                                </div>

                            </div> */}
                            <button type="button" className="btn btn-primary d-flex "
                                onClick={() => navigate('/PlayPage')}
                            ><span className="material-symbols-outlined mb-0" >arrow_back</span>Back</button>
                        </div>
                        <div className="col-12 ">
                            <label htmlFor className="text-left text-yellow">Enter Amount</label>
                        </div>
                        <div className="col-12 mb-4 d-flex justify-content-center">
                            <input id="amount-input" className="text-yellow" type="tel" value={Game_Ammount} onChange={(e) => setGame_Ammount(e.target.value)} />
                            <button 
                                id="amount-btn" 
                                className={`text-light ${isloading ? "disabled" : ""}`} 
                                onClick={(e) => {
                                    e.preventDefault();
                                    ChallengeCreate();
                                }} 
                                disabled={isloading}
                            >
                                {isloading ? "loading..." : "Set"}
                            </button>

                        </div>
                        {/* <div className="col-12">
                            <div className="slidecontainer">
                                <input type="range" min={500} max={20000} defaultValue={500} className="slider" id="myRange" onChange={handleSliderChange} />
                                <p className="text-light"><span id="demo">{sliderValue}</span></p>
                            </div>
                        </div> */}
                        {/* <div className="col-12 my-2 bg-purple2 py-3">
                            <CreateBattles fetchData={fetchData} battletype={propValue} />
                        </div> */}
                        <div className="col-12 my-2 bg-purple2 py-3">
                            <div className="row">
                                <div className="col-12  mb-3 d-flex justify-content-between text-light">
                                    <div className="d-flex">
                                        <h6 className="mb-0"><i className="bi bi-x-circle-fill text-danger" /> My Battles</h6>
                                    </div>
                                    {/* <p style={{ color: 'red' }}>{messageError}</p> */}

                                    <div className="d-flex">
                                        <h6 className="mb-0" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="guide-btn" style={{ cursor: "pointer" }}>Rules <i className="bi bi-info-circle" /></h6>
                                        {/* <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="guide-btn" className="" style={{ cursor: "pointer" }}>Rules &nbsp;<i className="bi bi-info-circle" /></button> */}

                                        <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ color: 'black' }}>Updated Game Rules (From 7th Feb 2023)</h1>
                                                    <button type="button" style={{ color: 'black' }} className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                                </div>
                                                <div className="modal-body">
                                                    <p className="text-center lh-md" style={{ color: 'black' }}>
                                                        यदि आपको लगता है की Opponent ने जान भूझकर गेम को Autoexit में छोड़ा है लेकिन Admin ने कैंसिल कर दिया है तो आपसे वीडियो प्रूफ माँगा जायेगा इसलिए हर गेम को रिकॉर्ड करना जरूरी है ! यदि आप वीडियो प्रूफ नहीं देते है तो गेम रिजल्ट एडमिन के अनुसार ही अपडेट किया जायेगा चाहे आप विन हो या गेम कैंसिल हो !
                                                        <br />
                                                        Game समाप्त होने के 15 मिनट के अंदर रिजल्ट डालना आवश्यक है अन्यथा Opponent के रिजल्ट के आधार पर गेम अपडेट कर दिया जायेगा चाहे आप जीते या हारे और इसमें पूरी ज़िम्मेदारी आपकी होगी इसमें बाद में कोई बदलाव नहीं किया जा सकता है!
                                                        <br />
                                                        Win होने के बाद आप गलत स्क्रीनशॉट डालते है तो गेम को सीधा Cancel कर दिया जायेगा इसलिए यदि आप स्क्रीनशॉट लेना भूल गए है तो पहले Live Chat में एडमिन को संपर्क करे उसके बाद ही उनके बताये। अनुसार रिजल्ट पोस्ट करे !
                                                        <br />
                                                        दोनों प्लेयर की टोकन (काटी) घर से बाहर न आयी हो तो लेफ्ट होकर गेम कैंसिल किया&nbsp;जा&nbsp;सकता&nbsp;है
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className='scroll-container'>
                                    {created &&
                                        created.map((allgame) =>
                                            (allgame.Game_type == game_type) && (allgame.Created_by._id.toString() === userAllData._id.toString()) &&
                                            (
                                                <Openbattles key={allgame._id} loading={false} created={created} game_type={game_type} allgame={allgame} user={user} deleteChallenge={deleteChallenge} getPost={getPost} RejectGame={RejectGame} winnAmount={winnAmount} AcceptChallang={AcceptChallang} updateChallenge={updateChallenge} />
                                            )
                                        )}

                                    {ownRunning && ownRunning.map((runnig) => {
                                        if (((user == runnig.Accepetd_By._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending")) : ((runnig.Status === "running" && user == runnig.Created_by._id) || (runnig.Status === "pending"))) || runnig.Status == "conflict") && runnig.Game_type == game_type && (runnig.Created_by._id.toString() === userAllData._id.toString()))
                                            return (

                                                <Runningbattles key={runnig._id} loading={false} runnig={runnig} user={user} winnAmount={winnAmount} />

                                            );
                                    })}
                                    {runningGames &&
                                        runningGames.map((runnig) => {
                                            if (((user == runnig.Accepetd_By._id || user == runnig.Created_by._id) ? (user == runnig.Accepetd_By._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending" && runnig.Acceptor_status == null)) : ((runnig.Status === "running" && user == runnig.Created_by._id) || (runnig.Status === "pending" && runnig.Creator_Status == null))) : (runnig.Status === "running" || runnig.Status === "pending")) && runnig.Game_type == game_type && (runnig.Created_by._id.toString() === userAllData._id.toString()))
                                                return (

                                                    <Runningbattles key={runnig._id} loading={false} runnig={runnig} user={user} winnAmount={winnAmount} />

                                                );
                                        })}
                                    {/* {allgame &&
                                        allgame.map((allgame) =>
                                            (
                                                (allgame.Status == "new" ||
                                                    (allgame.Status == "requested" && (user == allgame.Created_by._id || user == allgame.Accepetd_By._id)) ||
                                                    (allgame.Status == "running" && user == allgame.Accepetd_By._id && allgame.Acceptor_seen == false))
                                                && allgame.Game_type == game_type && (allgame.Created_by._id.toString() === userAllData._id.toString()) 
                                            ) &&
                                            (
                                                <div className="col-12 my-2 bg-purple2 py-3">
                                                    <Openbattles key={allgame._id} allgame={allgame} user={user} deleteChallenge={deleteChallenge} getPost={getPost} RejectGame={RejectGame} winnAmount={winnAmount} AcceptChallang={AcceptChallang} updateChallenge={updateChallenge} />
                                                </div>
                                            )
                                        )} */}
                                </div>

                            </div>
                        </div>

                        <div className="col-12 my-2 bg-purple2 py-3">
                            <div className="row">
                                <div className="col-12  mb-3 d-flex justify-content-between text-light">
                                    <div className="d-flex">
                                        <h6 className="mb-0"><i className="bi bi-x-circle-fill text-danger" /> Open Battles</h6>
                                    </div>
                                    {/* <p style={{ color: 'red' }}>{messageError}</p> */}

                                    <div className="d-flex">
                                        {/* <h6 className="mb-0">Rules <i className="bi bi-info-circle" /></h6> */}
                                        <h6 className="mb-0" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="guide-btn" style={{ cursor: "pointer" }}>Rules <i className="bi bi-info-circle" /></h6>

                                    </div>
                                </div>
                                <div className='scroll-container'>
                                    {created &&
                                        created.map((allgame) =>
                                            (allgame.Game_type == game_type) && (allgame.Created_by._id.toString() !== userAllData._id.toString()) &&
                                            (
                                                <Openbattles key={allgame._id} loading={false} created={created} game_type={game_type} allgame={allgame} user={user} deleteChallenge={deleteChallenge} getPost={getPost} RejectGame={RejectGame} winnAmount={winnAmount} AcceptChallang={AcceptChallang} updateChallenge={updateChallenge} />
                                            )
                                        )}
                                    {allgame &&
                                        allgame.map((allgame) =>
                                            (
                                                (allgame.Status == "new" ||
                                                    (allgame.Status == "requested" && (user == allgame.Created_by._id || user == allgame.Accepetd_By._id)) ||
                                                    (allgame.Status == "running" && user == allgame.Accepetd_By._id && allgame.Acceptor_seen == false))
                                                && allgame.Game_type == game_type
                                            ) &&
                                            (
                                                <div className="col-12 my-2 bg-purple2 py-3">
                                                    <Openbattles key={allgame._id} loading={false} allgame={allgame} user={user} deleteChallenge={deleteChallenge} getPost={getPost} RejectGame={RejectGame} winnAmount={winnAmount} AcceptChallang={AcceptChallang} updateChallenge={updateChallenge} />
                                                </div>
                                            )
                                        )}
                                </div>

                            </div>
                        </div>



                        {/* <div className="col-12 my-2 bg-purple2 py-3">
                            <Openbattles openBattles={openBattles} fetchData={fetchData} />
                        </div> */}
                        <div className="col-12 my-2 bg-purple2 py-3">

                            <div className="row">
                                <div className="col-12 mb-3 d-flex justify-content-between text-light">
                                    <div className="d-flex">
                                        <h6 className="mb-0"><i className="bi bi-x-circle-fill text-danger" /> Running Battles</h6>
                                    </div>
                                    <div className="d-flex">
                                        {/* <h6 className="mb-0">Rules <i className="bi bi-info-circle" /></h6> */}
                                        <h6 className="mb-0" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="guide-btn" style={{ cursor: "pointer" }}>Rules <i className="bi bi-info-circle" /></h6>

                                    </div>
                                </div>
                                <div className='scroll-container'>
                                    {ownRunning && ownRunning.map((runnig) => {
                                        if (((user == runnig.Accepetd_By._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending")) : ((runnig.Status === "running" && user == runnig.Created_by._id) || (runnig.Status === "pending"))) || runnig.Status == "conflict") && runnig.Game_type == game_type)
                                            return (

                                                <Runningbattles key={runnig._id} loading={false} runnig={runnig} user={user} winnAmount={winnAmount} />

                                            );
                                    })}
                                    {runningGames &&
                                        runningGames.map((runnig) => {
                                            if (((user == runnig.Accepetd_By._id || user == runnig.Created_by._id) ? (user == runnig.Accepetd_By._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending" && runnig.Acceptor_status == null)) : ((runnig.Status === "running" && user == runnig.Created_by._id) || (runnig.Status === "pending" && runnig.Creator_Status == null))) : (runnig.Status === "running" || runnig.Status === "pending")) && runnig.Game_type == game_type)
                                                return (

                                                    <Runningbattles key={runnig._id} loading={false} runnig={runnig} user={user} winnAmount={winnAmount} />

                                                );
                                        })}
                                </div>
                            </div>
                            {/* <Runningbattles runningBattles={runningBattles} /> */}
                        </div>
                    </div>
                </div >
                <div className="" style={{ position: 'fixed', top: '50%', left: 'calc(100% - 40%)', transform: `translate(-50%,-50%)`, zIndex: 5 }}>
                    <div className="rcBanner flex-center">
                        <Logo />
                        {/* <picture className="rcBanner-img-containerr">
                            <img style={{ marginLeft: '10px', width: "80% ", borderRadius: '50%' }} src="./images/Ludolkjpg.jpg" alt />
                        </picture>
                        <div className="rcBanner-text">Play Ludo &amp; <span className="rcBanner-text-bold">Win Real Cash!</span></div>
                        <div className="rcBanner-footer">For best experience, open&nbsp;<a href="/">LudoPlayers.com</a>&nbsp;on&nbsp;&nbsp;chrome </div> */}
                    </div>
                </div>
            </section >

        </>
    )
}

export default SecondPage;

