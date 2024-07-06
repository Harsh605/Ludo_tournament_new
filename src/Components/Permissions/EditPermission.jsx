import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from "react-router-dom";
import axios from 'axios'
import { startCase } from 'lodash';
import { baseURL } from '../../token';



function Permissions() {
    // let { id } = useParams();

    const location = useLocation();
    const id = location.state.id;
    const [user, setUser] = useState();
    const [set, setSet] = useState();
    const access_token = localStorage.getItem("access_token")

    const headers = {
        Authorization: `Bearer ${access_token}`
    }
    const getUser = () => {
        axios.get(baseURL+`get_user/${id}`, { headers })
            .then((res) => {
                if (res.data.Permissions) {
                    if (res.data.Permissions.length) {
                        setSet(true);
                    }
                }
                setUser(res.data)
            }).catch((e) => {
                if (e.response.status == 401) {
                    localStorage.removeItem('token');
                }
            })
    }
    const grantAccess = () => {
        try {
            axios.patch(baseURL+`agent/permission/${id}`, { headers })
                .then((res) => {
                    getUser();
                }).catch((e) => {
                    if (e.response.status == 401) {
                        localStorage.removeItem('token');
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }
    const giveAccess = (Status,ID) => {
        try {
            axios.post(baseURL+`agent/permission/nested/${ID}`,{
                Status
            }, { headers }) 
                .then((res) => {
                    getUser();
                }).catch((e) => {
                    if (e.response.status == 401) {
                        localStorage.removeItem('token');
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getUser();
    }, [])

    return (
        <div className="row mt-5">
            <div className="col-12 grid-margin mt-2" style={{ borderRadius: '5px', background: '#a6a6ff' }}>
                {user && <div className="card" style={{ borderRadius: '5px', background: '#a6a6ff' }}>
                    {!Boolean(set) && <button type="button" className="btn btn-success btn-lg mt-3" onClick={grantAccess}>Grant Permissions</button>}
                    {Boolean(set) && <div className='card-body' style={{ borderRadius: '5px', background: '#a6a6ff' }}>
                        <h4 className="card-title">Pages Permission</h4>
                        <ul className="list-group list-group-flush" style={{ marginTop: '2rem' ,borderRadius: '5px', background: '#a6a6ff' }}>
                            {user.Permissions.map((item, key) =>
                                <li key={key} className="list-group-item" style={{ borderRadius: '5px', background: '#a6a6ff' }}>
                                    <div style={{ borderRadius: '5px', background: '#a6a6ff' }}>
                                        <div>
                                            {startCase(item.Permission)}
                                        </div>
                                        <div>
                                            <div className="custom-control custom-switch" style={{cursor: "pointer"}}>
                                                <input type="checkbox" checked={item.Status} onChange={(e)=>giveAccess(!(item.Status),item._id)} className="custom-control-input" id={item.Permission} />
                                                <label className="custom-control-label" htmlFor={item.Permission} style={{cursor: "pointer"}}>Allow to access</label>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>}
                </div>}
            </div>
        </div>
    )
}

export default Permissions