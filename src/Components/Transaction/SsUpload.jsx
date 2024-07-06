import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../token';
import { HeadsetSharp } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ScreenshotUpload = ({ amount, setting }) => {
    const navigate = useNavigate();
    const [screenshot, setScreenshot] = useState(null);
    const [showRequestButton, setShowRequestButton] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [process, setProcess] = useState(false);
    const [scrnshot, setScrnshot] = useState(null);
    // const [imageUrl, setImageUrl] = useState(null); // State to hold the image URL

    const handleScreenshotChange = (e) => {
        setMessageError('');
        const file = e.target.files[0];
        console.log(file.name, amount);
        setScreenshot(file);
        setShowRequestButton(true); // Show the request button after uploading
        // setImageUrl(true);
    };

    const ManualPayment = async (e) => {
        e.preventDefault();
        const access_token = localStorage.getItem('access_token')
        const headers = {
            Authorization: `Bearer ${access_token}`,
        }
        const formData = new FormData();

        formData.append("Transaction_Screenshot", screenshot);
        formData.append("amount", amount);
        formData.append("referenceId", '1234567890');


        const response = await axios.post(
            baseURL + `/users/upload-transaction`,
            formData,
            { headers }
        );
        //console.log(response.data);
        if (response.data.status === 'Pending') {
            // setTimeout(() => {

           
            setTimeout(()=> {
                navigate('/UserPage')
                setTimeout(()=> {
                    Swal.fire({
                        title: 'Deposit submited successfully',
                        icon: 'success',
                        confirmButtonText: "OK",
                    });
                }, 300)
            }, 300)
        } if(!response.data.success) {
            Swal.fire({
                title: response.data.msg,
                icon: 'danger',
                confirmButtonText: "OK",
            });
        } else {
            // setProcess(false);
            Swal.fire({
                title: 'Deposit Falied',
                icon: 'danger',
                confirmButtonText: "OK",
            });
        }
    }

    const handleRequestClick = async () => {
        setMessageError('');
        if (screenshot && amount > 0) {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('file', screenshot);
                formData.append('amount', amount);

                const accessToken = localStorage.getItem('access_token'); // Retrieve access token from localStorage
                // const accessToken = token;
                // console.log(accessToken);
                const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

                // Make API request using axios
                const responsePromise = axios.post(baseURL + '/user/wallet/moneyrequest', formData, {
                    headers: headers
                })
                responsePromise.then(response => {
                    console.log('API response data:', response.data.data);
                    setMessageError("sent request successfully");
                }).catch(error => {
                    console.error(error);
                    setMessageError(error?.response?.data?.message);
                }).finally(() => {
                    setIsLoading(false);
                });
            } catch (error) {
                console.error(error);
                setMessageError(error?.response?.data?.message);
                setIsLoading(false);
            }
        }
    };
    // useEffect(() => {
    //     const fetchImage = async () => {
    //         try {
    //             const accessToken = localStorage.getItem('access_token');
    //             const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    //             const key = 'file_1692632288642.png';
    //             const response = await axios.get(`${baseURL}/image/${key}`, {
    //                 headers: headers,
    //                 responseType: 'arraybuffer',
    //             });
    //             console.log("response", response.data);

    //             // const imageBlob = new Blob([response.data]);
    //             // console.log(imageBlob);
    //             // const imageUrl = URL.createObjectURL(imageBlob);

    //             // console.log("imageurl", imageUrl);
    //             setImageUrl(response.data); // Update the state with the image URL
    //             console.log("image", imageUrl);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchImage();
    // }, [])

    return (
        <div>
            {/* <input style={{ margin: "auto", display: "flex", justifyContent: "center", marginTop: "20px" }} type="file" accept="image/*" onChange={handleScreenshotChange} /> */}
            <div class="input-group mb-3 mt-3" onChange={handleScreenshotChange} >
                <div className="col-12 my-1">
                    <label htmlFor="username" className="text-left text-yellow" >UPI ID</label>
                </div>
                <div className="col-12 mb-4" disabled>
                    <input type="text" className="details" value={setting?.upiId1 || setting?.upiId2 || setting?.upiId3} placeholder={setting?.upiId1 || setting?.upiId2 || setting?.upiId3} disabled />
                </div>
                <input type="file" class="form-control" id="inputGroupFile02" accept="image/*" />
            </div>
            {showRequestButton && <button onClick={ManualPayment} className='btn bg-orange' disabled={isLoading}>Send Request</button>}
            {isLoading && <p>Loading...</p>}
            <p>{messageError}</p>
            {/* Display the image */}
            {/* {imageUrl && <img src={imageUrl} alt="Uploaded Screenshot" />} */}
        </div>
    );
};

export default ScreenshotUpload;
