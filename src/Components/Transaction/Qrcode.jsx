// QRCodeDisplay.js
import React, { useState } from 'react';
import ScreenshotUpload from './SsUpload';

const QRCodeDisplay = ({ handleOpenQrCode, setting }) => {
    const [showQRCode, setShowQRCode] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [amount, setAmount] = useState(100);

    const handleamount = (e) => {
        setAmount(e.target.value);
    }

    const handlePayClick = () => {
        setShowQRCode(true);
        setShowUpload(true);
    };
    return (
        <div>
            {showQRCode ? (
                <div>
                    {/* Display QR code */}
                    <p style={{ textAlign: "center", fontSize: "25px" }}>PAY {amount} INR</p>
                    {setting.qrCode && <button onClick={handleOpenQrCode} className='btn btn-primary' style={{ margin: "auto", display: "block" }}>Scan With Qr Code</button>}

                    {showUpload && <ScreenshotUpload amount={amount} setting={setting} />}
                </div>
            ) : (
                <>
                    <div className="col-12 my-3">
                        <label htmlFor="username" className="text-left text-yellow">Enter Amount</label>
                    </div>
                    <div className="col-12 mb-4 d-flex justify-content-center">
                        <button id="buy-chips-btn" className="text-light"><i className="bi bi-currency-rupee" /></button>
                        <input id="buy-chips-input" className="text-yellow" type="text" onChange={(e) => { handleamount(e) }} value={amount} />
                    </div>
                    <div className="col-12">
                        <a >
                            <button className="bg-orange btn" onClick={handlePayClick}>Pay</button>
                        </a>
                    </div>
                </>
            )}
        </div>
    );
};

export default QRCodeDisplay;
