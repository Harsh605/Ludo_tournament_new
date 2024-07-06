import React, { useState } from 'react'
import { baseURL } from '../../token';
import axios from 'axios';
import HeaderComponent from '../HeaderComponent';

function CreateBattles({ fetchData, battletype }) {
    const [createBattles, setCreateBattles] = useState([]);
    const [messageError, setMessageError] = useState('');
    const [roomcode, setRoomcode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // console.log(createBattles);
    const handlecreate = async () => {
        setMessageError('');
        let roundedAmount = createBattles;
        if (roundedAmount % 50 != 0) {
            setMessageError("Please enter valid amount, amount should be multiple of 50");
            return
            // const roundedValue = Math.round(createBattles / 50);
            // roundedAmount = roundedValue * 50;
        }
        try {
            // if (battletype == 'quick') {
            //     if (createBattles > 500) {
            //         setMessageError("you cannot create battle more than 2000 in quick mode. Go to rich mode to play game more than 500.")
            //     }
            //     if (createBattles < 50) {
            //         setMessageError("you cannot create battle less than 50 in quick mode. Go to rich mode to play game less than 50.")
            //     }
            // }
            // if (battletype == 'rich') {
            //     if (createBattles > 20000) {
            //         setMessageError("you cannot create battle more than 20000 in rich mode.")
            //     }
            //     if (createBattles < 500) {
            //         setMessageError("you cannot create battle less than 500 in rich mode. Go to quick mode to play game less than 500. ")
            //     }
            // }

            // let roundedAmount = createBattles;
            // if (roundedAmount % 50 != 0) {
            //     const roundedValue = Math.round(createBattles / 50);
            //     roundedAmount = roundedValue * 50;
            // }
            setIsLoading(true);
            const requestbody = {
                category: battletype,
                price: roundedAmount,
                roomcode: roomcode
            }
            const accessToken = localStorage.getItem('access_token'); // Retrieve access token from localStorage
            // const accessToken = token;
            console.log("accesstoken", localStorage.getItem('accessToken'));
            console.log(accessToken);
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            const response = await axios.post(baseURL + '/challenge', requestbody, {
                headers: headers
            });

            if (response.data) {
                < HeaderComponent />
                setIsLoading(false);
                setMessageError("battle created successfully");
                setCreateBattles('');
                setRoomcode('');
                setMessageError('');
                fetchData();
            }
            // console.log(response);
        } catch (error) {
            setMessageError(error?.response?.data?.message)
            fetchData()
            console.error("error", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-12 mb-3 d-flex justify-content-between text-light">
                <div className="d-flex">
                    <h6 className="mb-0">
                        <i className="bi bi-x-circle-fill text-danger" /> Create Battles
                    </h6>
                </div>
                <div className='d-flex' >
                    {battletype === "quick" ? (
                        <p className="mb-0 ml-2 mr-auto  "> <strong>(50-30000)</strong></p>
                    ) : (
                        <p className="mb-0 ml-2 mr-auto"><strong>(500-30000)</strong></p>
                    )}

                </div>

            </div>

            <div className="col-12 card my-1 walletcard pt-2 px-0 mx-auto text-white" >
                <div className="row">
                </div>
                <div className="card-body walletbody mt-2">
                    <div className="row">
                        <div className="col-12 my-2">
                            <input className='create-battles-input'
                                type="text"
                                onChange={(e) => setCreateBattles(e.target.value)}
                                placeholder='Enter Amount'
                                value={createBattles}
                            />
                        </div>
                        <div className="col-12 my-2">
                            <input className='create-battles-input'
                                type="text"
                                onChange={(e) => setRoomcode(e.target.value)}
                                placeholder='Enter Your Room code'
                                value={roomcode}
                            />
                        </div>
                    </div>
                    <p>{messageError}</p>
                    {isLoading && <p>Loading...</p>}
                    <button className="bg-orange-create-battles-button btn " disabled={isLoading} onClick={handlecreate}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateBattles
