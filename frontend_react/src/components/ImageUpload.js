import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from './IpAdr'; 

const ImageUpload = ({ userId }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${apiUrl}/upload_receipt/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('File upload failed');
        }
    };

    return (
        <div>
            <h2>Image Upload</h2>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
};

export default ImageUpload;