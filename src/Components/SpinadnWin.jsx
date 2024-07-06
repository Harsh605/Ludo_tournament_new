import React, { useEffect, useState } from 'react'
import HeaderComponent from './HeaderComponent';

function SpinadnWin() {
  const [spinning, setSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState();
  const [userData, setUserData] = useState({});

  const startSpin = () => {
    setSpinning(true);
    setRotationAngle(); // Reset rotation angle
    setTimeout(() => {
      setSpinning(false);
      setRotationAngle(Math.random() * 360); // Set a random rotation angle
    }, 10000); // Stop spinning after 5 seconds
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
  MyData()
}, [])

  return (
    <>
      <section id="main-bg">
        <div id="refer-container" className="container mx-0">
          <div className="row">
            <div className="col-12">
              <HeaderComponent userData={userData} />
            </div>
            <div className={`col-12 object-fit-contain text-center my-3 ${spinning ? 'spin-animation' : ''}`} style={{ transform: `rotate(${rotationAngle}deg)` }}>
              <img src="./images/Spin.png" alt="spin" id="spin-img" />
            </div>
          </div>
          <div href="#" className="text-center row my-2 mx-auto text-decoration-none " onClick={startSpin} >
            <button className="col-12 my-auto btn-purple" id>Play Daily Free Spin</button>
          </div>
          <div href="#" className="text-center row my-2 mx-auto text-decoration-none" onClick={startSpin}  >
            <button className="col-12 btn-purple my-auto">Spin Now For Free</button>
          </div>
          <div className="row">
            <div className="col-12 p-2 mt-1">
              <div className="card info-ludo text-white text-center p-0 my-1">
                <div className="card-body rounded profilecard text-center align-items-center justify-content-center p-2">
                  <ul className="list-group">
                    <li className="list-group-item spin-win-content d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <p className="text-light mb-0"> Rajesh Kumar Meena WON 50</p>
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-light mb-0" id="win-time">13 hours ago</p>
                      </div>
                    </li>
                    <li className="list-group-item spin-win-content d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <p className="text-light mb-0"> Rajesh Kumar Meena WON 50</p>
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-light mb-0" id="win-time">13 hours ago</p>
                      </div>
                    </li>
                    <li className="list-group-item spin-win-content d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <p className="text-light mb-0"> Rajesh Kumar Meena WON 50</p>
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-light mb-0" id="win-time">13 hours ago</p>
                      </div>
                    </li>
                    <li className="list-group-item spin-win-content d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <p className="text-light mb-0"> Rajesh Kumar Meena WON 50</p>
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-light mb-0" id="win-time">13 hours ago</p>
                      </div>
                    </li>
                    <li className="list-group-item spin-win-content d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <p className="text-light mb-0"> Rajesh Kumar Meena WON 50</p>
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-light mb-0" id="win-time">13 hours ago</p>
                      </div>
                    </li>
                    <li className="list-group-item spin-win-content d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <p className="text-light mb-0"> Rajesh Kumar Meena WON 50</p>
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-light mb-0" id="win-time">13 hours ago</p>
                      </div>
                    </li>
                    <li className="list-group-item spin-win-content d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <p className="text-light mb-0"> Rajesh Kumar Meena WON 50</p>
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-light mb-0" id="win-time">13 hours ago</p>
                      </div>
                    </li>
                    <li className="list-group-item spin-win-content d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <p className="text-light mb-0"> Rajesh Kumar Meena WON 50</p>
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-light mb-0" id="win-time">13 hours ago</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default SpinadnWin;