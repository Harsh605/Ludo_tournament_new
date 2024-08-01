import React, { useState, useEffect } from 'react'
import HeaderComponent from '../HeaderComponent';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../token';

function getRandomUsername() {
    const usernameLength = Math.floor(Math.random() * 3) + 8; // Random username length between 8 and 10 characters
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let username = '';
    for (let i = 0; i < usernameLength; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        username += charset[randomIndex];
    }
    return username;
}

function getRandomPrice() {
    const minPrice = 2; // Minimum multiplier greater than 1
    const maxPrice = 600; // Maximum multiplier
    const randomMultiplier = Math.floor(Math.random() * (maxPrice / minPrice + 1)); // Random multiplier
    const price = minPrice * randomMultiplier * 50; // Ensure it's a multiple of 50 and greater than 50
    return price;
}

function generateRandomBattles(numBattles) {
    const battles = [];
    for (let i = 0; i < numBattles; i++) {
        const battle = {
            price: getRandomPrice(),
            ChallengerUser: { username: getRandomUsername() },
            AcceptorUser: { username: getRandomUsername() },
        };
        battles.push(battle);
    }
    return battles;
}


const Runningbattles = ({ runnig, user, winnAmount, key }) => {
    const navigate = useNavigate()
    function getRandomAvatar() {
        // const randomIndex = Math.floor(Math.random() * avatars.length);
        // return avatars[randomIndex];
    }


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
    //         setCommission(response?.data?.data?.commission);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    // useEffect(() => {
    //     fetchpenalty();
    //     const intervalId = setInterval(() => {
    //         const newBattles = generateRandomBattles(30);   //30 battles
    //         // setFakebattles(newBattles);
    //     }, 5000);
    //     const initialBattles = generateRandomBattles(30);
    //     // setFakebattles(initialBattles);
    //     return () => clearInterval(intervalId);
    // }, []);

    return (
        <div className="col-12 card my-1 walletcard pt-2 px-0 mx-auto text-white" key={key}>
            <div className="row">
                <div className="col-lg-9 d-flex justify-content-start">
                    <span className="mx-2 mb-0 d-flex" style={{ fontSize: '15px', fontWeight: '600' }}>PLAYING FOR&nbsp;<span className="material-symbols-outlined text-success">payments</span> {runnig.Game_Ammount}</span>
                    {(user == runnig.Accepetd_By._id || user == runnig.Created_by._id) && (
                        <span className='mx-2 mb-0 d-flex'><button
                            className={`mx-1 ${runnig.Status == "conflict" ? "bg-danger" : "bg-success"
                                }`}
                            style={{ width: '80px', height: '29px', fontSize: '11px' }}
                            onClick={() => navigate(`/viewgame/${runnig._id}`, { state: { prevPath: window.location.pathname } })}

                        >
                            view
                        </button></span>
                    )}
                </div>
                <div className="col-lg-3 d-flex justify-content-end" style={{paddingRight: '30px'}}>
                    <p className="mb-0">Prize&nbsp; {runnig.Game_Ammount + winnAmount(runnig.Game_Ammount)}</p>
                    {/* <div className="pr-3 text-center col-5">

                                    <div className="pl-2">
                                        {runnig.Created_by.avatar ? (
                                            <img
                                                src={
                                                    baseUrl + `${runnig.Created_by && runnig.Created_by.avatar}`
                                                }
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = { getRandomAvatar };
                                                }}
                                                alt=""
                                                width="35px"
                                                height="35px"
                                                style={{
                                                    borderTopLeftRadius: "50%",
                                                    borderTopRightRadius: "50%",
                                                    borderBottomRightRadius: "50%",
                                                    borderBottomLeftRadius: "50%",
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={getRandomAvatar()}
                                                alt=""
                                                width="35px"
                                                height="35px"
                                                style={{
                                                    borderTopLeftRadius: "50%",
                                                    borderTopRightRadius: "50%",
                                                    borderBottomRightRadius: "50%",
                                                    borderBottomLeftRadius: "50%",
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div style={{ lineHeight: 1 }}>
                                        <span className={css.betCard_playerName}>
                                            {runnig.Created_by.Name}
                                        </span>
                                    </div>
                                </div> */}
                    {/* <h6 className="mb-0 d-flex"><span className="material-symbols-outlined text-success">payments</span> {(battle.price * 2) - ((commission * battle.price * 2) / 100)}</h6> */}
                </div>
            </div>
            <div className="card-body walletbody mt-2">
                <div className="row">
                    <div className="col-4">
                        <p className="text-light mb-0">{runnig.Created_by.Name}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-center">
                        <img src="/images/versus.png" className="rounded-circle mx-1" style={{ width: '25%', height: 25 }} alt="" />
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                        <p className="text-light text-end mb-0">{runnig.Accepetd_By.Name}</p>
                    </div>
                    {/* <div>
                                    <button className="btn bg-orange" style={{ marginTop: '1em', marginBottom: '1em' }} onClick={() => { handleOpen(battle.challenger, battle.price, battle.roomcode, battle.id) }}>Open</button>
                                </div> */}
                    {/* <button className="btn bg-orange" onClick={() => handleplaybtn(battle.id, battle.price, battle.roomcode, battle.challenger)} >Play</button> */}
                    {/* <button className="btn bg-orange" onClick={handlePlaybtn}>Play</button> */}
                </div>
            </div>
        </div >
    )
}

export default Runningbattles


