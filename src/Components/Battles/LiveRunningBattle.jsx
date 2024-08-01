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


const LiveRunningBattle = ({ runnig, user, winnAmount, key }) => {
    const navigate = useNavigate()
    const access_token = localStorage.getItem("access_token")

 
    return (
        <div className="col-12 card my-1 walletcard pt-2 px-2 py-2 mx-auto text-white" key={key}>
            <div className="row">
                <div className="col-lg-9 d-flex justify-content-between">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">Game in Progress</span>
                    </div>
                    {/* <span className="mx-2 mb-0 d-flex" style={{ fontSize: '15px', fontWeight: '600' }}>PLAYING FOR&nbsp;<span className="material-symbols-outlined text-success">payments</span> {runnig.Game_Ammount}</span> */}
                    {(user == runnig.Accepetd_By._id || user == runnig.Created_by._id) && runnig.is_live_game === true  && (
                        <span className='mx-2 mb-0 d-flex'><button
                            className={`mx-1  rounded-lg ${runnig.Status == "conflict" ? "bg-danger" : "bg-warning"
                                }`}
                            style={{ width: '80px', height: '29px', fontSize: '11px' }}
                        >
                            <a className='text-white text-decoration-none' href={`${baseURL}/ludo/${runnig?.Room_code}?token=${access_token}&game_id=${runnig._id}`} target='_blank'>Rejoin now</a>
                        </button></span>
                    )}
                </div>
                {/* <div className="col-lg-3 d-flex justify-content-end" style={{paddingRight: '30px'}}>
                    <p className="mb-0">Prize&nbsp; {runnig.Game_Ammount + winnAmount(runnig.Game_Ammount)}</p>
                  
                </div> */}
            </div>
            
        </div >
    )
}

export default LiveRunningBattle


