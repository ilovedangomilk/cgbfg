// src/components/CameraComponent.js
import React, { useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from './IpAdr'; 
import Loading from './LoadingPage';
import './Camera.css';
import { Box, Heading, Text, Stack, SimpleGrid, Image, Flex, Button } from '@chakra-ui/react'; 

const videoConstraints = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  facingMode: "environment" // Use the rear camera if available
};

function CameraComponent({ userId }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const webcamRef = React.useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    handleTakePhoto(imageSrc);
  }, [webcamRef]);

  function handleTakePhoto(dataUri) {
    setIsLoading(true);
    const url = `${apiUrl}/upload_receipt/${userId}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: dataUri }),
    })
    .then(response => response.json())
    .then(data => {
      setIsLoading(false);
      navigate('/items', { state: { items: data.extracted_text } });
    })
    .catch((error) => {
      console.error('Error:', error);
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <Loading />;  // Show loading component if isLoading is true
  }

  function handleCancel() {
    navigate(-1); // Navigate to the previous page
  }

  return (
    <div className="camera-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="webcam"
      />
      <Button onClick={capture}
        position="absolute"
        zIndex="1002"
        bottom="50px"
        bg="#19956d"
        color="white"
        borderRadius="20px"
        width="190px"
        height="60px"
        _hover={{ bg: "#19956d" }}
       >Capture</Button>
      <Button onClick={handleCancel} 
        position="absolute"
        zIndex="1002"
        top="20px"
        left="20px"
        bg="#EDF2F7"
        color="#888888"
        borderRadius="20px"
        width="95px"
        height="30px"
        _hover={{ bg: "#19956d" }}
      >Cancel</Button>
    </div>
  );
}

export default CameraComponent;



// // src/components/CameraComponent.js
// import React, { useState } from 'react';
// import Camera from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
// import { useNavigate } from 'react-router-dom';
// import { apiUrl } from './IpAdr'; 
// import Loading from './LoadingPage';
// import './Camera.css';

// function CameraComponent({ userId }) {
//   /* function handleTakePhoto(dataUri) {
//     // Construct the URL with the user ID
//     const url = `${apiUrl}/scan_receipt/${userId}`;

//     // Send the captured photo to the backend
//     fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ image: dataUri }),
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Extracted Text:', data.extracted_text);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
//   } */

//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   function handleTakePhoto(dataUri) {
//     setIsLoading(true);
//     const url = `${apiUrl}/upload_receipt/${userId}`;

//     fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ image: dataUri }),
//     })
//     .then(response => response.json())
//     .then(data => {
//       setIsLoading(false);
//       // Navigate to ItemsList and pass the extracted items data
//       navigate('/items', { state: { items: data.extracted_text } });
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       setIsLoading(false);
//     });
//   }

//   if (isLoading) {
//     return <Loading />;  // Show loading component if isLoading is true
//   }

//   return (
//     <Camera
//       onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
//     />
//   );
// }



// export default CameraComponent;

