import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Input, TextField } from '@mui/material';
import { Select, Option } from "@material-tailwind/react";
import QRCodeDisplay from './Qrcode';
import { useEffect } from 'react';
import { baseURL } from '../../token';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
export default function ScannerDialog({ open, setOpen, setting }) {

    return (
        <div>
            <BootstrapDialog
                sx={{ zIndex: "11000" }}
                onClose={() => setOpen(false)}
                aria-labelledby="customized-dialog-title"
                open={open}
            >


                <div style={{ placeItems: 'center ', padding: "10px" }}>Scan Qr code, take screenshot and upload the screenshot   <img style={{ width: '300px', margin: "auto", marginBottom: "10px" }} src={baseURL + '/' + setting.qrCodeImage} alt="QR Code" /></div>

            </BootstrapDialog >
        </div >
    );
}
