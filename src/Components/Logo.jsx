import React from 'react'
import logo from '../styles/logo.jpg'

const Logo = () => {
    return (
        <div>
            <picture className="rcBanner-img-containerr">
                <img style={{ marginLeft: '10px', width: "80% ", borderRadius: '50%' }} src={logo} alt />
            </picture>
            <div className="rcBanner-text">Play Ludo &amp; <span className="rcBanner-text-bold">Win Real Cash!</span></div>
            <div className="rcBanner-footer">For best experience, open&nbsp;<a href="/">khelludokhel.info</a>&nbsp;on&nbsp;&nbsp;chrome </div>
        </div>
    )
}

export default Logo;