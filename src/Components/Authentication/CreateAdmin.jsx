import React, { useState } from 'react';
import { Button, TextField, Typography, Container, NativeSelect } from '@mui/material';
import './AdminRegistrationPage.css'
import { Padding } from '@mui/icons-material';
import { baseURL } from '../../token';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleUnAuthorized } from '../hooks/handleUnAuthorized';

function AdminRegistrationPage() {
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        name: '',
        username: '',
        password: '',
    });
    const [message, setMessage] = useState("");
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const navigate = useNavigate()

    const handleAdminRegistration = async () => {
        console.log('object :>> ', formData.phone, formData.email, formData.name, formData.user_type, formData.password);
        if (!formData.phone || !formData.email || !formData.name || !formData.user_type || !formData.password)
            alert("Fill below all fields")
        try {
            const requestBody = {
                Phone: formData.phone,
                Email: formData.email,
                Name: formData.name,
                user_type: formData.user_type,
                // username: formData.username,
                Password: formData.password,
            };
            // console.log(requestBody);

            const accessToken = localStorage.getItem('access_token');
            const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

            console.log(headers);
            const response = await axios.post(baseURL + 'admin/register', requestBody, {
                headers: headers,
            });

            console.log(response);

            if (response.data === "Email have already") {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Email already exist`,
                });
                return
            }
            if (response.data === "Phone have already") {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Phone already exist`,
                });
                return
            }
            if (response.status === 200) {
                navigate("/AdminManager")
            }
        }
        catch (err) {
            console.log(err);
            setMessage(err?.response?.data?.message)
            handleUnAuthorized(err.response.data, navigate)

            // Enable the Get OTP button
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ padding: '44px' }}>
            <div className="registration-container">
                <Typography variant="h5">Admin Registration</Typography>
                <TextField
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Phone"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                        if (e.target.value.length === 11) {
                            return
                        }
                        handleInputChange(e)
                    }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <NativeSelect fullWidth
                    label="Select Type"
                    variant="outlined"
                    name="user_type"
                    sx={{ marginTop: "10px" }}
                    onChange={(e) => handleInputChange(e)}>
                    <option value="" disabled selected>Select Type</option>
                    {['Admin', 'Agent']?.map((data, index) => (
                        <option value={data}>{data}</option>
                    ))}
                </NativeSelect>
                {/* <TextField
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                /> */}
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <p style={{ color: "black" }}>{message}</p>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleAdminRegistration}
                >
                    Create Admin
                </Button>
            </div>
        </Container>
    );
}

export default AdminRegistrationPage;
