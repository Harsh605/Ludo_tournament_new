import React, { useEffect, useRef, useState } from 'react'
import HeaderComponent from '../Components/HeaderComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScrollTrigger } from '@mui/material';
import { baseURL, socketURL, } from '../token';
import axios from 'axios';
import copy from "copy-to-clipboard";
import Logo from '../Components/Logo';
import Swal from 'sweetalert2';
import swal from 'sweetalert';
import './style.css'
import { handleUnAuthorized } from '../Components/hooks/handleUnAuthorized'

// import ScreenshotUpload from '../Components/Transaction/SsUpload';

function EnterFirstGame(props) {
    // const [challengeruser, setChallengerUser] = useState('');
    // const [acceptoruser, setAcceptorUser] = useState('');
    // const navigate = useNavigate();
    // const [message, setMessage] = useState('');
    // const [isLoading, setIsLoading] = useState(false);
    // // const navigate = useNavigate();

    // const location = useLocation();
    // // const roomcode = location.state.roomcode;
    // // const price = location.state.priceplay;
    // // const challengerid = location.state.challengeruserid;
    // // const type = location.state.type;
    // // const challengeID = location.state.id;
    // // const propvalue = location.state.propvalue;
    // const roomcode = '123';
    // const price = '2435';
    // const challengerid = '23423';
    // const type = '2324';
    // const challengeID = '234234';
    // const propvalue = 'sdjfhsdj';


    // const [victory, setVictory] = useState(false);
    // const [screenshot, setScreenshot] = useState(null);
    // // const [imageUrl, setImageUrl] = useState(null); // State to hold the image URL

    // const handleScreenshotChange = (e) => {
    //     setMessage('')
    //     const file = e.target.files[0];
    //     // console.log(file.name, amount);
    //     setScreenshot(file);
    //     // setImageUrl(true);
    // };


    // const handleRequestClick = async () => {
    //     setMessage('')
    //     console.log(victory, screenshot);
    //     if (victory == "true") {
    //         if (!screenshot) {
    //             setMessage("please choose image");
    //             setIsLoading(false);
    //             return;
    //         }
    //     }
    //     try {
    //         setIsLoading(true);
    //         console.log(challengerid);
    //         const formData = new FormData();
    //         formData.append('file', screenshot);
    //         // formData.append('amount', challengerid);
    //         formData.append('victory', victory);
    //         formData.append('challengeId', challengeID);

    //         const accessToken = localStorage.getItem('access_token'); // Retrieve access token from localStorage
    //         // const accessToken = token;
    //         // console.log(accessToken);
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    //         // Make API request using axios
    //         const responsePromise = axios.post(baseURL + '/challenge/result', formData, {
    //             headers: headers
    //         })
    //         console.log(responsePromise);
    //         responsePromise.then(response => {
    //             console.log('API response data:', response.data);
    //             setMessage("sent request successfully");
    //             setIsLoading(false);
    //             navigate('/PlayPage')
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         setMessage(error?.response?.data?.message);
    //         setIsLoading(false);
    //     }
    // };

    // // const handleRequestClick = async () => {
    // //     setMessage('');
    // //     console.log(screenshot);
    // //     if (screenshot) {
    // //         try {
    // //             console.log("screenshot", screenshot);
    // //             console.log("victopry", victory);
    // //             console.log("victory", challengerid);

    // //             let formData = new FormData();
    // //             formData.append('file', screenshot);
    // //             formData.append('victory', victory);
    // //             formData.append('challengeId', challengerid);

    // //             console.log(formData);
    // //             const accessToken = localStorage.getItem('access_token');
    // //             const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    // //             const response = await axios.post(baseURL + '/challenge/result', formData, {
    // //                 headers: headers,
    // //             });

    // //             console.log('API response data:', response.data.data);
    // //             response.then(resp => {
    // //                 console.log('API response data:', resp.data.data);
    // //                 setMessage("request submitted successfully");
    // //             });
    // //         } catch (error) {
    // //             console.error(error);
    // //             setMessage(error?.response?.data?.message)
    // //         }
    // //     } else {
    // //         console.error('Screenshot is null.');
    // //         setMessage("Screenshot is null")
    // //     }
    // // };

    // const handleBackbtn = () => {
    //     setMessage('')
    //     navigate("/PlayPage")
    //     // navigate("/SecondPage", { state: { propKey: propvalue } })
    //     // console.log("heyy");
    //     // console.log(navigate);
    // }
    // useEffect(() => {
    //     fetch();
    // }, [])
    // const fetch = async () => {
    //     setMessage('');
    //     try {
    //         const accessToken = localStorage.getItem('access_token'); // Retrieve access token from localStorage
    //         // console.log(accessToken);
    //         const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    //         console.log(headers);
    //         const response = await axios.get(`${baseURL}/user`, {
    //             headers: headers
    //         });
    //         console.log("acceptor", response.data.data);
    //         setAcceptorUser(response.data.data.username);

    //         const reseponsechallenger = await axios.get(`${baseURL}/user/${challengerid}`, {
    //             headers: headers
    //         });
    //         // console.log("challenger", reseponsechallenger.data);
    //         console.log(reseponsechallenger.data.data.username);
    //         setChallengerUser(reseponsechallenger.data.data.username)
    //     } catch (error) {
    //         console.error("error:--", error);
    //         setMessage(error?.response?.data?.message);
    //     }
    // }
    // const handleCopyCode = () => {
    //     // copy(roomcode)
    //     setMessage("copied code");
    //     console.log(roomcode);
    //     navigator.clipboard.writeText(roomcode);
    // };

    // const handleResult = (vict) => {
    //     setMessage('')
    //     setVictory(vict);
    // }


    const navigate = useNavigate()
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const [Game, setGame] = useState()
    const [status, setStatus] = useState(null);
    const [fecthStatus, setFecthStatus] = useState()
    const [scrnshot, setScrnshot] = useState(null)
    const [scrnshot1, setScrnshot1] = useState("")// ADDED BY TEAM

    const [reason, setReason] = useState(null)
    const [dropDown, setDropDown] = useState(null)
    const [socket, setSocket] = useState();
    const [roomcode, setRoomcode] = useState('')
    const [setting, setSetting] = useState({})
    let submitReq = useRef(false);
    const isMounted = useRef(true);

    const [submitProcess, setProcess] = useState(true);

    const access_token = localStorage.getItem("access_token")

    // Encode the data you want to pass
    const dataToPass = encodeURIComponent(JSON.stringify({
        token: access_token,
        game_id: path
    }));

    const getSetting = async () => {
        
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseURL + `/settings/data`
            , { headers })
            .then((res) => {
                setSetting(res.data)
                // socket.emit('challengeOngoing');
            })
            .catch(e => {
                console.log('e.message :>> ', e.message);
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
                // if (e.response.status == 401) {
                //     localStorage.removeItem('token');
                //     localStorage.removeItem('token');
                //     window.location.reload()
                //     navigate("/LoginPage")
                // }
            })
    }
    // const getPost = async () => {
    //     const access_token = localStorage.getItem("access_token")
    //     const headers = {
    //         Authorization: `Bearer ${access_token}`
    //     }
    //     await axios.patch(baseURL + `/challange/roomcode/${path}`,
    //         {
    //             Room_code: roomcode
    //         }
    //         , { headers })
    //         .then((res) => {
    //             //let gameUrl = "http://84.247.133.7:5010/ludo/6v401d";
    //             setGame(res.data)
    //             socket.emit('challengeOngoing');
                
    //         })
    //         .catch(e => {
    //             console.log('e.message :>> ', e.message);
    //             if (e.response.status == 401) {
    //                 handleUnAuthorized(e.response.status, navigate)
    //             }
    //             // if (e.response.status == 401) {
    //             //     localStorage.removeItem('token');
    //             //     localStorage.removeItem('token');
    //             //     window.location.reload()
    //             //     navigate("/LoginPage")
    //             // }
    //         })
    // }

    const getPost = async () => {
        // const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        // Add the axios post call here
         await axios.patch(baseURL + `/challange/roomcode/${path}`,
            {
                Room_code: roomcode
            },
            { headers }
        )
        .then((res) => {
            setGame(res.data)
            socket.emit('challengeOngoing');  
            //window.open(response.data, '_blank'); // Open in a new page/tab                
        })
        .catch(e => {
            console.log('e.message :>> ', e.message);
            if (e.response.status === 401) {
                handleUnAuthorized(e.response.status, navigate)
            }
        })
    
        
    }
    const createLudoOnSiteGame = async () => {
        // const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }

        localStorage.setItem('ludo_game_id', path);
        
        // Add the axios post call here
        await axios.post(baseURL, {
            action_to_do: "create",
            token : access_token,
            game_id: path,
        })
        .then(async (response) => {
            console.log('Post request successful:', response.data);
            var parts = response.data.split('/');
            var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash

    
            await axios.patch(baseURL + `/challange/roomcode/${path}`,
                {
                    Room_code: lastSegment
                },
                { headers }
            )
            .then((res) => {
                setGame(res.data)
                socket.emit('challengeOngoing');  
                
               // window.open(response.data, '_blank'); // Open in a new page/tab   
               
               const newTabURL = `${response.data}?token=${access_token}&game_id=${path}`;
               window.open(newTabURL, '_blank'); // Open in a new page/tab

                
            })
            .catch(e => {
                console.log('e.message :>> ', e.message);
                if (e.response.status === 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
            })
        })
        .catch((err) => {
            console.error('Post request failed:', err.message);
        });
    
        
    }
    
    /// user details start


    const [user, setUser] = useState()
    const [userAllData, setUserAllData] = useState()

    const role = async () => {
        // const access_token = localStorage.getItem("access_token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseURL + `/me`, { headers })
            .then((res) => {
                setUser(res.data._id)
                setUserAllData(res.data)
                // // console.log(res.data._id)
                Allgames(res.data._id)
                getCode(res.data._id);
                // setTimeout(() => {
                // }, 1000);
                // checkExpire();
                // if(!res.data.Room_join)
                // {
                // }


            })
            .catch(e => {
                console.log('e.message11 :>> ', e.message);
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
                // if (e.response.status == 401) {
                //     localStorage.removeItem('token');
                //     localStorage.removeItem('token');
                //     window.location.reload()
                //     navigate("/LoginPage")
                // }
            })

    }

    /// user details end

    const [ALL, setALL] = useState()

    const Allgames = async (userId) => {
        const access_token = localStorage.getItem('access_token')
        const headers = {
            Authorization: `Bearer ${access_token}`
        }

        await axios.get(baseURL + `/challange/${path}`, { headers })
            .then((res) => {
                if (res.data.Status == "new" || res.data.Status == "requested") {
                    setTimeout(async () => {
                        await axios.get(baseURL + `/challange/${path}`, { headers })
                            .then((res) => {
                                if (res.data.Status == "new" || res.data.Status == "requested") {
                                    navigate(-1);
                                }
                                else {
                                    setProcess(false);
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                                navigate(-1);
                            })
                    }, 10000);
                }
                else {
                    setProcess(false)
                }
                setALL(res.data)
                setGame(res.data)
                // // console.log(res.data.Accepetd_By._id)
                console.log('res.data.Acceptor_status :>> ', res.data.Acceptor_status, res.data.Creator_Status, userId);
                if (userId == res?.data?.Accepetd_By?._id)
                    setFecthStatus(res.data.Acceptor_status)

                if (userId == res?.data?.Created_by?._id)
                    setFecthStatus(res.data.Creator_Status)


            })
            .catch(e => {
                console.log('e.message 444 :>> ', e.message);
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
                // if (e.response.status == 401) {
                //     localStorage.removeItem('token');
                //     localStorage.removeItem('token');
                //     window.location.reload()
                //     navigate("/LoginPage")
                // }
            })
    }
    const getCode = async (userId) => {
        const access_token = localStorage.getItem('access_token')
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseURL + `/game/roomcode/get/${path}`, { headers })
            .then((res) => {
                //setALL(res.data)
                Allgames(userId)
                if (res.data?.Accepetd_By == userId && res.data.Room_code == 0) {
                    setTimeout(async () => {
                        window.location.reload()
                    }, 10000)
                }

            }).catch(e => {
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
            })

    }
    const checkExpire = async () => {
        const access_token = localStorage.getItem('access_token')
        const headers = {
            Authorization: `Bearer ${access_token}`
        }

        await axios.get(baseURL + `/game/roomcode/expire/${path}`, { headers })
            .then((res) => {

                navigate(-1);
            })
            .catch(e => {
                if (e.response.status == 401) {
                    handleUnAuthorized(e.response.status, navigate)
                }
            })
    }

    useEffect(() => {
        getSetting()
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
                    if (socket._socketListeners[event])
                        socket._socketListeners[event](data);
                } catch (error) {
                    console.log(error);
                }
            }
            socket.listen('ping', (data) => {
                socket.emit('pong', 2)
                clearTimeout(socket.pingTimeout);
                socket.pingTimeout = setTimeout(() => {
                    socket.close();
                    setSocket(undefined);
                }, 30000 + 1000);
            })

            socket.listen("pageReloadSocketReceive", (data) => {
               window.location.reload();
            });
        }
        function closeFunc() {
            socket.onclose = () => {
                console.log('socket disconnected wow 😡');
                if (isMounted.current) {
                    clearTimeout(socket.pingTimeout);
                    setSocket(undefined);
                    let socket = new WebSocket(socketURL);
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
        let access_token = localStorage.getItem('access_token');
        access_token = localStorage.getItem('access_token');
        if (!access_token) {
            window.location.reload()
            navigate("/LoginPage");
        }
        // console.log(history.location)

        role();


    }, [])


    const clearImage = (e) => {
        setScrnshot1(null)
        setScrnshot(null)
        setStatus(null)
    }

    // Result

    const Result = async (e) => {
        e.preventDefault();
        let notification;
        if (status === "lose")
            notification = await swal({
                title: "Are you sure?",
                text: "Once deleted, you will be not able to change the status!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })

        if (!notification && status === 'lose')
            return
        if (submitReq.current == false) {
            submitReq.current = true;
            // const access_token = localStorage.getItem("access_token")
            const headers = {
                Authorization: `Bearer ${access_token}`
            }
            if (status) {
                setProcess(true);
                const formData = new FormData();
                formData.append('file', scrnshot);
                formData.append('status', status);
                if (status == 'cancelled') {
                    formData.append('reason', reason);
                }

                await axios({
                    method: "post",
                    url: baseURL + `/challange/result/${path}`,
                    data: formData,
                    headers: headers,
                }).then((res) => {
                    console.log('object :>> >>>>');
                    Allgames(user)
                    socket.emit('resultAPI');
                    submitReq.current = false;
                    setProcess(false);
                    //navigate(-1);
                    window.location.reload();
                })
                    .catch((e) => {
                        if (e.response.status == 401) {
                            handleUnAuthorized(e.response.status, navigate(-1))
                        }
                        // if (e.response?.status == 401) {
                        //     localStorage.removeItem('token');
                        //     localStorage.removeItem('token');
                        //     window.location.reload()
                        //     navigate("/LoginPage")
                        // }
                    })
            }
            else {
                submitReq.current = false;
                alert('please fill all field or Re-Select result status')
            }

        }

    }



    const copyCode = (e) => {
        // console.log(Game.Room_code);
        navigator.clipboard.writeText(Game.Room_code);

        Swal.fire({
            position: 'center',
            icon: 'success',
            type: 'success',
            title: 'Room Code Copied',
            showConfirmButton: false,
            timer: 1200,


        });

    }
    const Completionist = () => <span>You are good to go!</span>;

    // ADDED BY TEAM
    const handleChange = (e) => {
        setScrnshot1(URL.createObjectURL(e.target.files[0]))
        setScrnshot(e.target.files[0])
    }

    const [selectedMode, setSelectedMode] = useState("");

    useEffect(() => {
        // Get the gameMode from localStorage when the component mounts
        const savedGameMode = localStorage.getItem("gameMode");
        if (savedGameMode) {
            setSelectedMode(savedGameMode);
        }
    }, []);

    return (
        <>
            <section id="main-bg">
                <div id="wallet-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12">
                            <HeaderComponent userData={userAllData} />
                        </div>
                        <div className="col-12 my-3">
                            <div className="row align-items-center my-2">
                                <div className="my-auto col-6 text-white" onClick={() => { navigate(-1) }}>

                                    <button type="button" className="btn btn-primary d-flex " onClick={() => { navigate(-1) }}><span className="material-symbols-outlined mb-0" >arrow_back</span>Back</button>

                                </div>
                                <div className="col-6 d-flex justify-content-end">
                                    <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" id="guide-btn" className="btn btn-outline-primary bg-light" style={{ cursor: "pointer" }}>Rules</button>
                                    {/* Modal */}
                                    <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Updated Game Rules (From 7th Feb 2023)</h1>
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
                        </div>
                        <div className="col-12   pt-2 px-0 mx-auto text-white d-flex justify-content-center">
                            <div className="card-body card  mx-2 walletcard mt-2">
                                <div className="row">
                                    <div className="col-4">
                                        {/* {Game?.Created_by?.avatar ? (<img
                                            src={baseURL + `${Game.Created_by.avatar}`} onError={(e) => { e.target.onerror = null; e.target.src = "https://jaipurludo.com/user.png" }}
                                            width='50px' height="50px"
                                            alt=''
                                            style={{ borderTopLeftRadius: "50%", borderTopRightRadius: "50%", borderBottomRightRadius: "50%", borderBottomLeftRadius: "50%" }}
                                        />) : ( */}
                                        
                                        <img
                                            src={'/images/img.jpg'}
                                            width='50px' height="50px"
                                            alt=''
                                            style={{ borderTopLeftRadius: "50%", borderTopRightRadius: "50%", borderBottomRightRadius: "50%", borderBottomLeftRadius: "50%" }}
                                        />
                                        
                                        
                                        {/* <img src="./images/img.jpg" className="rounded-circle mx-1 " style={{ width: '25%' }} alt /> */}
                                    </div>
                                    <div className="col-4 d-flex justify-content-center">
                                        <img src="/images/versus.png" className="rounded-circle mx-1" style={{ width: '25%' }} alt />
                                    </div>
                                    <div className="col-4 d-flex justify-content-end">
                                        {/* {Game?.Accepetd_By.avatar ? (<img src={baseURL + `${Game?.Accepetd_By.avatar}`} width='50px' height="50px" alt=''
                                            style={{ borderTopLeftRadius: "50%", borderTopRightRadius: "50%", borderBottomRightRadius: "50%", borderBottomLeftRadius: "50%" }}
                                        />) : ( */}
                                        
                                        <img
                                            src={'/images/img.jpg'}
                                            width='50px' height="50px"
                                            alt=''
                                            style={{ borderTopLeftRadius: "50%", borderTopRightRadius: "50%", borderBottomRightRadius: "50%", borderBottomLeftRadius: "50%" }}
                                        />
                               

                                        {/* <img src="./images/img.jpg" className="rounded-circle mx-1" style={{ width: '25%' }} alt /> */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <p className="text-light">{Game?.Created_by && Game?.Created_by?.Name}</p>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center">
                                        <p className="text-success text-end"><strong> Rs {Game?.Game_Ammount}</strong></p>
                                    </div>
                                    <div className="col-4 d-flex justify-content-end">
                                        <p className="text-light text-end">{Game?.Accepetd_By && Game.Accepetd_By.Name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* {type === "openbattle" ? */}
                    {fecthStatus !== null && fecthStatus !== undefined ? null : (<>
                        <div className='row'>
                        <div className="col-12 card mt-3 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="text-center">{selectedMode === "offSite" ? "Room Code" : "Live ludo game play"}</div>
                            <div className="card-body walletbody mt-2">
                                {Game?.Room_code == null &&
                                    <div className='roomCode cxy flex-column text-center'>
                                        {selectedMode === "offSite" ? "Waiting for Room Code..." : null}
                                        <h6>{selectedMode === "offSite" ? "रूम कोड का इंतजार है।" : "Wait for joning link"}</h6>
                                        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                    </div>
                                    || Game?.Room_code != 0 &&
                                    <div className='roomCode cxy flex-column text-center'>

                                        <div className='text-center'>
                                            <div>{selectedMode === "offSite" ? "Room Code" : null}</div>
                                            {
                                                selectedMode === "offSite" ? <span>{Game?.Room_code}</span> : <button className='history-btn mt-2' style={{ width: '12rem', borderRadius: '6px' }}><a href={`${baseURL}/ludo/${Game?.Room_code}?token=${access_token}&game_id=${path}`} target="_blank" className='text-white no-underline'>Play game</a></button>
                                            }
                                            {/* <span>{Game?.Room_code}</span> */}
                                            
                                        </div>
                                        

                                        {
                                            selectedMode === "offSite" ? <button className='history-btn mt-2' style={{ width: '12rem', borderRadius: '6px' }} onClick={(e) => copyCode(e)} >
                                            Copy Code
                                        </button> : null

                                        }
                                        
                                    </div>
                                    || Game?.Room_code == 0 && (Game?.Created_by._id == user && <div className='roomCode cxy flex-column text-center'>

                                        {
                                            selectedMode === "offSite" ? (<>Set Room Code
                                                <h6>लूडो किंग से रूम कोड अपलोड करें</h6>
                                                <input type='number' className="form-control mt-1 w-75 text-center" style={{ backgroundColor: '#e8eeee', border: '1px solid #47a44780', marginLeft: '4rem' }} value={roomcode} onChange={(e) => setRoomcode(e.target.value)} />
                                                <button className='history-btn mt-2' style={{ width: '12rem', borderRadius: '6px' }} type="button " onClick={() => getPost()}>Set Room code</button>
                                               </>)  :  (<>
                                            {/* <h6>लूडो किंग से रूम कोड अपलोड करें</h6> */}
                                            {/* <input type='number' className="form-control mt-1 w-75 text-center" style={{ backgroundColor: '#e8eeee', border: '1px solid #47a44780', marginLeft: '4rem' }} value={roomcode} onChange={(e) => setRoomcode(e.target.value)} /> */}
                                            <button className='history-btn mt-2' style={{ width: '12rem', borderRadius: '6px' }} type="button " onClick={() => createLudoOnSiteGame()}>Play</button>
                                           </>)
                                        }
                                       
                                    </div> || (Game?.Accepetd_By._id == user) &&
                                        <div className='roomCode cxy flex-column text-center'>
                                           {selectedMode === "offSite" ? "Waiting for Room Code..." : "Wait for joning link"}
                                           <h6>{selectedMode === "offSite" ? "रूम कोड का इंतजार है।" : null}</h6>
                                            <div className="lds-spinner text-white"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

                                        </div>)

                                }
                                {/* <div className="col-12 py-2 ">
                                        <h5 className="text-center text-purple"><strong><span>{roomcode}</span></strong></h5>
                                    </div>
                                    {/* <p>{message}</p>
                                    <a className="text-center row my-2 mx-auto text-decoration-none" onClick={handleCopyCode}>
                                        <button className="col-12 btn rounded btn-primary my-auto d-flex justify-content-center"><i className="bi bi-clipboard2-check" onClick={() => handleCopyCode} />Copy Code</button>
                                    </a> */}
                                {/* <a data-bs-toggle="modal" data-bs-target="#exampleModal2" className="text-center row my-2 mx-auto text-decoration-none">
                                    <button className="col-12 btn  my-auto btn-danger">Game Rules Updated</button>
                                </a> */}

                                {selectedMode === "offSite" ? (<><div className="col-12 py-2 ">
                                    <p className="text-center text-light">
                                        After completion of your game select the status of the game and post your screenshot below.
                                    </p>
                                </div></>) : null}
                                
                                {/* Modal */}
                                <div className="modal fade" id="exampleModal3" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            {/* <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Updated Game Rules (From 7th Feb 2023)</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                            </div>
                                            <div className="modal-body" style={{ color: 'black' }}>
                                                <p className="text-center lh-md" style={{ color: 'black' }}>
                                                    यदि आपको लगता है की Opponent ने जान भूझकर गेम को Autoexit में छोड़ा है लेकिन Admin ने कैंसिल कर दिया है तो आपसे वीडियो प्रूफ माँगा जायेगा इसलिए हर गेम को रिकॉर्ड करना जरूरी है ! यदि आप वीडियो प्रूफ नहीं देते है तो गेम रिजल्ट एडमिन के अनुसार ही अपडेट किया जायेगा चाहे आप विन हो या गेम कैंसिल हो !
                                                    <br />
                                                    Game समाप्त होने के 15 मिनट के अंदर रिजल्ट डालना आवश्यक है अन्यथा Opponent के रिजल्ट के आधार पर गेम अपडेट कर दिया जायेगा चाहे आप जीते या हारे और इसमें पूरी ज़िम्मेदारी आपकी होगी इसमें बाद में कोई बदलाव नहीं किया जा सकता है!
                                                    <br />
                                                    Win होने के बाद आप गलत स्क्रीनशॉट डालते है तो गेम को सीधा Cancel कर दिया जायेगा इसलिए यदि आप स्क्रीनशॉट लेना भूल गए है तो पहले Live Chat में एडमिन को संपर्क करे उसके बाद ही उनके बताये। अनुसार रिजल्ट पोस्ट करे !
                                                    <br />
                                                    दोनों प्लेयर की टोकन (काटी) घर से बाहर न आयी हो तो लेफ्ट होकर गेम कैंसिल किया&nbsp;जा&nbsp;सकता&nbsp;है
                                                </p>
                                            </div> */}
                                            <div className='rules'>
                                                <span className='cxy mb-1'>
                                                    <u>Game Rules</u>
                                                </span>
                                                <ol className='list-group list-group-numbered'>
                                                    <li className='list-group-item'>
                                                        Record every game while playing.
                                                    </li>
                                                    <li className='list-group-item'>
                                                        For cancellation of game, video proof is necessary.
                                                    </li>
                                                    <li className='list-group-item'>
                                                        {/* <img
                      className='mx-1'
                      src={process.env.PUBLIC_URL + 'Images/LandingPage_img/global-rupeeIcon.png'}
                      width='21px'
                      alt=''
                    /> */}
                                                        <h6 className="d-none  text-danger d-block text-center">
                                                            ◉ महत्वपूर्ण नोट:कृपया गलत गेम परिणाम अपलोड न करें, अन्यथा आपके वॉलेट बैलेंस पर penalty लगाई जायगी।  गलत रिजल्ट अपडेट करने पर 50 रुपये पेनल्टी लगेगी।
                                                        </h6>
                                                    </li>
                                                    <li className='list-group-item'>
                                                        {/* <img
                      className='mx-1'
                      src={process.env.PUBLIC_URL + 'Images/LandingPage_img/global-rupeeIcon.png'}
                      width='21px'
                      alt=''
                    /> */}
                                                        <h6 className="d-none  text-danger d-block text-center">
                                                            महत्वपूर्ण नोट: यदि आप गेम के परिणामों को अपडेट नहीं करते हैं, तो आपके वॉलेट बैलेंस पर जुर्माना लगाया जाएगा। रिजल्ट अपडेट नहीं करने पर 25 रुपये पेनल्टी लगेगी।
                                                        </h6>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>)}
                    
                    {/* : */}
                    <div className='row'>
                        <div className="col-12 card mt-3 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="text-center">Match Status</div>
                            <div className="card-body walletbody mt-2">
                                <div className="col-12 py-2 ">
                                    <form className='result-area text-center' onSubmit={(e) => { Result(e) }} encType="multipart/form-data">
                                        {fecthStatus !== null && fecthStatus !== undefined && <p>You have already updated your battle result for <h6 className='d-inline-block text-uppercase'><b>{fecthStatus}</b></h6></p>}
                                        {/* {console.log('fecthStatusfecthStatusfecthStatusfecthStatus >> ', fecthStatus)} */}
                                        {fecthStatus === null && <> <p>
                                        {selectedMode === "offSite" ? `After completion of your game, select the status of the game and post your screenshot below.
                                            After completion of your game, select the status of the game
                                            and post your screenshot below.` : null}
                                        
                                        </p>
                                            <div
                                                className='MuiFormGroup-root radios mt-1'
                                                role='radiogroup'
                                                aria-label='Result'
                                            >
                                                <label className='MuiFormControlLabel-root hidden Mui-disabled'>
                                                    <span
                                                        className='MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root MuiRadio-colorSecondary jss2 Mui-checked jss3 Mui-disabled MuiIconButton-colorSecondary Mui-disabled Mui-disabled'
                                                        tabIndex={-1}
                                                        aria-disabled='true'
                                                    >
                                                        <span className='MuiIconButton-label'>
                                                            <input
                                                                className='jss4 mr-2'

                                                                name='battleResult'
                                                                type='radio'
                                                                defaultValue='select'
                                                                defaultChecked
                                                                style={{ transform: 'scale(1.5)' }}
                                                            />

                                                        </span>
                                                    </span>
                                                    <span className='MuiTypography-root MuiFormControlLabel-label Mui-disabled MuiTypography-body1' style={{ marginTop: '3px' }}>
                                                        (Disabled option)
                                                    </span>
                                                </label>
                                                {

                                                  selectedMode === "offSite" ? (<>
                                                <label className='MuiFormControlLabel-root'>
                                                    <span
                                                        className='MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root jss8'
                                                        aria-disabled='false'
                                                    >
                                                        <span className='MuiIconButton-label'>
                                                            <input
                                                                className='jss4 mr-2'
                                                                name='battleResult'
                                                                type='radio'
                                                                defaultValue='winn'
                                                                onClick={(e) => setStatus("winn")}
                                                                style={{ transform: 'scale(1.5)' }}
                                                            />

                                                        </span>
                                                        <span className='MuiTouchRipple-root' />
                                                    </span>
                                                    <span className='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1' style={{ marginTop: '3px' }}>
                                                        I Won
                                                    </span>
                                                </label>
                                                <label className='MuiFormControlLabel-root ml-3'>
                                                    <span
                                                        className='MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root MuiRadio-colorSecondary MuiIconButton-colorSecondary'
                                                        aria-disabled='false'
                                                        root='[object Object]'
                                                    >
                                                        <span className='MuiIconButton-label'>
                                                            <input
                                                                className='jss4 mr-2'
                                                                name='battleResult'
                                                                type='radio'
                                                                defaultValue='lose'
                                                                onClick={(e) => {

                                                                    setStatus("lose")
                                                                }}
                                                                style={{ transform: 'scale(1.5)' }}
                                                            />
                                                        </span>
                                                        <span className='MuiTouchRipple-root' />
                                                    </span>
                                                    <span className='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1' style={{ marginTop: '3px' }}>
                                                        I Lost
                                                    </span>
                                                </label>
                                                <label className='MuiFormControlLabel-root ml-3'>
                                                    <span
                                                        className='MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root'
                                                        aria-disabled='false'
                                                    >
                                                        <span className='MuiIconButton-label'>
                                                            <input
                                                                className='jss4 mr-2'
                                                                name='battleResult'
                                                                type='radio'
                                                                defaultValue='cancelled'
                                                                onClick={(e) => setStatus("cancelled")}
                                                                style={{ transform: 'scale(1.5)' }}

                                                            />
                                                        </span>
                                                        <span className='MuiTouchRipple-root' />
                                                    </span>
                                                    <span className='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1' style={{ marginTop: '3px' }}>
                                                        Cancel
                                                    </span>
                                                </label>
                                                </>) : (<><label className='MuiFormControlLabel-root ml-3'>
                                                    <span
                                                        className='MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root'
                                                        aria-disabled='false'
                                                    >
                                                        <span className='MuiIconButton-label'>
                                                            <input
                                                                className='jss4 mr-2'
                                                                name='battleResult'
                                                                type='radio'
                                                                defaultValue='cancelled'
                                                                onClick={(e) => setStatus("cancelled")}
                                                                style={{ transform: 'scale(1.5)' }}

                                                            />
                                                        </span>
                                                        <span className='MuiTouchRipple-root' />
                                                    </span>
                                                    <span className='MuiTypography-root MuiFormControlLabel-label MuiTypography-body1' style={{ marginTop: '3px' }}>
                                                        Cancel
                                                    </span>
                                                </label></>)
                                                }
                                                
                                            </div></>}

                                        {status !== null && status !== 'cancelled' && status !== 'lose' && <div className={`doc_upload mt-3`} >
                                            {/* <input type="file" onChange={(e) => setScrnshot(e.target.files[0])} accept="image/*" required /> */}
                                            {/* ADDED BY TEAM */}
                                            <input type="file" onChange={handleChange} accept="image/*" required className='ml-5' />
                                            {scrnshot && <div className={'uploaded'} style={{ marginTop: '-7.3rem' }}>
                                                <img src="/images/file-icon.png" width="26px" alt="" style={{ marginRight: '20px' }} />
                                                <div className="d-flex flex-column" style={{ width: '80%' }}>
                                                    <div className={`name text-white mt-1 ml-5`} style={{ height: '25px' }}>Photo: {scrnshot.name}</div>
                                                    <div className={'text-white mt-1 mr-5'}>Size: {(scrnshot.size / 1024 / 1024).toFixed(2)} MB</div>
                                                </div>
                                                <div className="image-block">
                                                    <img src="/images/global-cross.png" width="10px" alt="" onClick={clearImage} />
                                                </div>
                                            </div>}
                                            {/* ADDED BY TEAM */}
                                            {!scrnshot && <div className="cxy flex-column ">
                                                <i class="fa-solid fa-arrow-up"></i>
                                                {/* <img src={process.env.PUBLIC_URL + '/Images/upload_icon.png'} width="17px" alt="" className="snip-img" /> */}
                                                <div className={`text-center text-white`}>
                                                    Upload screenshot.
                                                </div>
                                            </div>}

                                        </div>}
                                        {status !== null && status == 'cancelled' && <div class="form-group mt-1">
                                            <select class="form-control border-secondary" onChange={(e) => { setReason(e.target.value); setDropDown(e.target.value) }} required>
                                                <option value="" selected disabled>Select Cancelled Option</option>
                                                <option value="Game not start">Game not start</option>
                                                <option value="Wrong room code">Wrong room code</option>
                                                <option value="No one is available for play">No one is available for play</option>
                                                <option value="Other play left the game">Other play left the game</option>
                                                <option value="Other">Other (text)</option>
                                            </select>
                                            {dropDown === "Other" && <textarea class="form-control border-secondary mt-1" name="" id="" rows="3" onChange={(e) => { setReason(e.target.value) }} required></textarea>}

                                        </div>}

                                        {/* ADDED BY TEAM */}
                                        {scrnshot && <div style={{ width: "100%" }}>
                                            <img src={scrnshot1} style={{ width: "100%", height: '340px', marginTop: '4rem' }} />
                                        </div>}

                                        {/* ADDED BY TEAM */}

                                        {/* <button type='submit' className='btn btn-danger mt-3 text-white' id="post" onSubmit={(e) => { e.preventDefault(); Result() }}>Post Result</button> */}
                                        {fecthStatus == null && fecthStatus == undefined && <input type='submit' className='btn btn-danger mt-3 text-white text-center' id="post" />}
                                    </form>
                                </div>
                                {/* <a className="text-center row my-2 mx-auto text-decoration-none">
                                    <button className="col-12 btn rounded btn-success my-auto d-flex justify-content-center" data-bs-toggle="modal" data-bs-target="#exampleModal1"
                                    // onClick={() => { handleResult("true") }}
                                    >I Won</button>
                                </a>
                                <a className="text-center row my-2 mx-auto text-decoration-none">
                                    <button className="col-12 btn  my-auto btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal1"
                                    // onClick={() => { handleResult("false") }}
                                    >I Lost</button>
                                </a> */}
                            </div>
                            {/* <p>{message}</p> */}
                        </div>
                        {
                            selectedMode === "offSite" ? (<>
                             <div className="col-12 card my-3 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="text-center">Penalty</div>
                            <div className="card-body walletbody mt-2">
                                <table className="table table-bordered table-bg">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="bg-transparent text-light w-25">Amount</th>
                                            <th scope="col" className="bg-transparent text-light w-75">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-bg-body">
                                        <tr>
                                            <td className="bg-transparent  text-light"><i className="bi bi-currency-rupee" />{setting.wrongUpdatePenalty || 0}</td>
                                            <td className="bg-transparent text-light">
                                                <h6 className="text-center">Wrong Update Penalty</h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bg-transparent  text-light"><i className="bi bi-currency-rupee" />{setting.noUpdatePenalty || 0}</td>
                                            <td className="bg-transparent text-light">
                                                <h6 className="text-center">No Update Penalty</h6>
                                            </td>
                                        </tr>
                                        {/* <tr>
                                            <td className="bg-transparent  text-light"><i className="bi bi-currency-rupee" />50</td>
                                            <td className="bg-transparent text-light">
                                                <h6 className="text-center">No Update</h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bg-transparent  text-light"><i className="bi bi-currency-rupee" />25</td>
                                            <td className="bg-transparent text-light">
                                                <h6 className="text-center">Abusing</h6>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                            </>) : null
                        }
                       
                        <div className="modal fade" id="exampleModal1" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="false">
                            <div className="modal-dialog  modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        {/* {victory == "true" ?
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Upload Result</h1>
                                            : <h1 className="modal-title fs-5" id="exampleModalLabel">Warning</h1>} */}
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                        // onClick={() => { setMessage("") }} 
                                        />
                                    </div>
                                    <div className="modal-body">
                                        {/* {victory == "true" ?
                                            <a className="text-center row my-2 mx-auto text-decoration-none">
                                                <input className="col-12 btn rounded btn-primary my-auto d-flex justify-content-center" type="file" accept="image/*" onChange={handleScreenshotChange} />
                                            </a>
                                            :
                                            <p>Are you sure, Do you want to confirm?</p>
                                        } */}
                                        {/* {isLoading && <p>Loading...</p>} */}
                                        {/* <p>{message}</p> */}
                                        {/* {message ?
                                            <a className="text-center row my-2 mx-auto text-decoration-none" onClick={handleRequestClick}>
                                                <button disabled={isLoading} className="col-12 btn  my-auto btn-success">Submit</button>
                                            </a>
                                            :
                                            <a className="text-center row my-2 mx-auto text-decoration-none" onClick={handleRequestClick}>
                                                <button disabled={isLoading} data-bs-dismiss="modal" className="col-12 btn  my-auto btn-success">Submit</button>
                                            </a>
                                        } */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* } */}
                </div>
                <div className="" style={{ position: 'fixed', top: '50%', left: 'calc(100% - 40%)', transform: `translate(-50%,-50%)`, zIndex: 5 }}>
                    <div className="rcBanner flex-center">
                        <Logo />

                        {/* <picture className="rcBanner-img-containerr">
                            <img style={{ marginLeft: '10px', width: "80% ", borderRadius: '50%' }} src="./images/Ludolkjpg.jpg" alt />
                        </picture>
                        <div className="rcBanner-text">Play Ludo &amp; <span className="rcBanner-text-bold">Win Real Cash!</span></div>
                        <div className="rcBanner-footer">For best experience, open&nbsp;<a href="/">khelludokhel.info</a>&nbsp;on&nbsp;&nbsp;chrome </div> */}
                    </div>
                </div >
            </section>
        </>
    )
}

export default EnterFirstGame;