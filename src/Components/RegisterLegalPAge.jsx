import React, { useState } from 'react'
// import { useState } from 'react';
import HeaderComponent from './HeaderComponent';
import Logo from '../styles/logo.jpg'
import { useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../token';

function RegisterLegalPage() {
    const [activeCard, setActiveCard] = useState(null);
    const [userData, setUserData] = useState({});

    const handleCardClick = (cardNumber) => {
        setActiveCard(cardNumber);
    };

    const MyData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const responsedetails = await axios.get(baseURL + '/me', {
                headers: headers,
            });
            setUserData(responsedetails.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(()=> {
        // MyData()
    }, [])


    return (
        <>

            <section id="main-bg">
                <div id="legalterms-container" className="container mx-0">
                    <div className="row">
                        <div className="col-12 mb-5">
                            {/* <HeaderComponent userData={userData} /> */}

                        </div>
                        <div className="col-12 card my-1 walletcard pt-2 px-0 mx-auto text-white">
                            <div className="row" id="card1" onClick={() => handleCardClick(1)} >
                                <div className="col d-flex justify-content-between">
                                    <h6 className="mx-2">Terms and Conditions</h6>
                                    <h6 className="mx-2 text-end" />
                                </div>
                            </div>
                            <div className="card-body walletbody mt-2" id="card-body1" style={{ display: activeCard === 0 ? 'block' : 'block' }}>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="text-light lh-lg">
                                            These <strong className="text-purple">terms and conditions</strong>  of use (“Terms”) along with privacy policy (“Privacy Policy”) forms a legally binding agreement (“Agreement”) between You and us <a href className="text-warning">( ludowinners.in )</a>
                                            <br />
                                            Hence, We insist that You read these Terms and Privacy Policy and let Us know if You have any questions regarding the same. We will try Our best to answer Your queries.
                                            <br />
                                            <strong className="text-purple">A. USERS’ APPROVAL</strong>
                                            <br />
                                            1. Users approve of and accept over Agreement by:
                                            <br />
                                            (a) reading all terms and condition
                                            <br />
                                            (b) reading all rules of this app
                                            <br />
                                            2. Users may accept this Agreement only if:
                                            <br />
                                            (a) Such User is a natural person, is of the legal age (18 years or older), eligibility and mental capacity to form a binding contract with us.
                                            <br />
                                            (b) Such User is a not a resident of Tamil Nadu, Andhra Pradesh, Telangana, Assam, Orissa, Kerala, Sikkim, Nagaland, or Gujarat.
                                            <br />
                                            (c) Such User is a juristic person, is lawfully existing, and has all the authorizations, permits, and allowances to enter into this Agreement and form a binding contract.
                                            <br />
                                            (d) Such User is not legally barred or restricted from using the App.
                                            <br />
                                            3. You understand that We want You to not use the App if You do not understand, approve of or accept all the terms specified in this Agreement. Hence, You are requested to read these Terms and Privacy Policy carefully and understand the Agreement before You accept it and agree to be bound by it.
                                            <br />
                                            4. The Agreement shall govern the relationship of each User with us. However, We may also execute separate written agreements with its Users. In case of conflict between terms of such separate written agreement and this Agreement, the terms of the separate written agreement shall prevail.
                                            <br />
                                            <strong className="text-purple">B. PROVISION OF THE APP</strong>
                                            <br />
                                            1. Section 12 of the Public Gambling Act, 1867 provides that games of mere skill are exempt from the application of the Act. The Supreme Court of India and various High Courts in India have opined that a game of mere skill is a game “in which, although the element of chance necessarily cannot be entirely eliminated, success depends principally upon the superior knowledge, training, attention, experience and adroitness of the player. A game of skill is one in which the element of skill predominates over the element of chance.” No penalty can be imposed upon a person for playing such games of skill.
                                            <br />
                                            2. Users must note that ‘Ludo’ game available for challenge in our platform is ‘Games of Skill’, under Indian law, and that we does not support, endorse or offer to Users ‘games of chance’ for money. While ‘Games of Skill’ do not have a comprehensive definition, they are those games where the impact of a player’s effort and skill on the outcome of a game is higher than the impact of luck and chance.
                                            <br />
                                            3. It may be noted that States are permitted, by the Indian Constitution, to enact laws regulating betting and gambling in their respective jurisdictions. In furtherance of these powers, various States have enacted anti- gambling legislations. Such legislations are largely in concert with the Public Gambling Act of 1867 (and include the exception of “games of skill”). Where a State legislation on gambling exists, it prevails over the Public Gambling Act of 1867. In this regard, the Assam Game and Betting Act, 1970 and Orissa (Prevention of) Gambling Act, 1955 and Telangana State Gaming (Amendment) Ordinance and High Court Judgment in Gujarat, 2017 prohibits games with money stakes and also does not create an exception for games of skill. Therefore, currently, residents of Assam, Odisha, Telangana and Gujarat are not permitted to play on our site.
                                            <br />
                                            4. The games rules are clearly defined on this platform and Users are encouraged to read, understand and follow these rules to be successful in these games.
                                            <br />
                                            5. The games on our platform are ‘Games of Skills’, such that the outcome / success in the games is directly dependent on the User’s effort, performance and skill. By choosing how to play, the actions of Users shall have direct impact on the game.
                                            <br />
                                            6. Every game will have some elements of chance, but in the form of challenges / obstacles that a User would be able to overcome using his/her skills and knowledge of the game. Elements of luck are present in every game to add thrill and excitement, but no two attempts at a game are identical so Users must use their skills in order to be successful
                                            <br />
                                            7. Since the games available on our platform can be won through Users’ skills and such skills may be enhanced with practice and experience, the performance of a User may improve with time and practice.
                                            <br />
                                            8. Certain games may have pre-determined outcomes (Ludo), and these outcomes are achievable by Users using their skills.
                                            <br />
                                            <strong className="text-purple">C. GAME RULES</strong>
                                            <br />
                                            1. Player who sets a challenge will share a room id/room code with his/her opponent.
                                            <br />
                                            2. On winning both players have to update there results in following manner:
                                            <br />
                                            (a) if you have won, select ‘I Won’ option and upload winning screenshot of the game.
                                            <br />
                                            (b) if you have lost, select ‘I Lost’ option.
                                            <br />
                                            (c) if match is not started and both parties doesn't want to play, select ‘Cancel’ option.
                                            <br />
                                            3. User must have to record every game, and if any player is hacking or cheating a game, contact support.
                                            <br />
                                            4. If game is not started, if you haven't played a single move yourself, please show the recording of game to support. Game will be cancelled only if you have recording.
                                            <br />
                                            5. If you don't have any proof against player cheating and error in game, you will be considered as lost.
                                            <br />
                                            6. If you have not moved a single pawn or no pawn is open at home, your game will be cancelled.
                                            <br />
                                            7. If your opponent leaves match purposely in starting or initial game, and opponent doesn't have any valid proof for cancellation, you will&nbsp;be&nbsp;awarded&nbsp;win.
                                            <strong className="text-purple"> D.  DEPOSIT / WITHDRAWAL</strong>
                                            <br />
                                            1. Players can deposit their balance in Buy <strong className="text-purple">Cash section</strong> .
                                            <br />
                                            <strong className="text-purple">Important</strong> :- If we detect any type of suspecious transaction/activity in your account, in such cases we have rights to Block your account temporarily. Kindly contact Admins in such cases and provided the needed details to Un-block your account.
                                            <br />
                                            2. Player can take withdrawal by setting a Sell Request on your app.
                                            <br />
                                            3. Deposit and withdrawal requests are completed by support at any time.
                                            <br />
                                            4. Any wrong payment detail given by you, will not be considered in refund.
                                            <br />
                                            5. Once a withdrawal is done, you don't have any authority to raise any query.
                                            <br />
                                            6. If withdrawal request go on pending, user must have to wait for 1-5 days.
                                            <br />
                                            <strong className="text-purple">E.  PENALITY FOR WRONG UPDATES</strong>
                                            <br />
                                            1. If you put the wrong update on any match, you will be charged penality of:
                                            <br />
                                            (a) if your game is below 1000, penalty will be 10%.
                                            <br />
                                            (b) if your game is above 1000 and below 5000, penality will be 50 flat.
                                            <br />
                                            (c) if your game is above 5000 and below 15000, penality will be 100 flat.
                                            <br />
                                            2. If you don't update result after losing, you will be charged penality of 25 flat.
                                            <br />
                                            3. Players can have only single account in case multiple accounts found, We have authority to ban those account permanently &amp; add penalty
                                            <br />
                                            <strong className="text-purple">F. COMMISSION CHARGES</strong>
                                            <br />
                                            1. Net 3% commission (after referral money deduction) will be charged on challenge amount.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
               

            </section >
        </>
    )

}

export default RegisterLegalPage;