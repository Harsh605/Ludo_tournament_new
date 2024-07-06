import React from 'react';

const ImageViewer = ({ imageUrl }) => {
    return (
        <div className="image-viewer-overlay">
            <div className="image-viewer-content">
                {/* <h1>{user_id}</h1> */}
                <img src={imageUrl} alt="Image" />
            </div>
        </div>
    );
};

export default ImageViewer;
