import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

const CameraComponent = ({ theme, changeTheme }) => {
    const [showWebcam, setShowWebcam] = useState(false);
    const webcamRef = useRef(null);
    const [isCameraAccessible, setIsCameraAccessible] = useState(true);
    const handleScanClick = () => {
        setShowWebcam(true);
    };

    const handleUserMediaError = () => {
      setIsCameraAccessible(false);
      console.log('Error in cam');
    };
  
    const handleUserMediaSuccess = () => {
      setIsCameraAccessible(true);
    };
    const requestCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        handleUserMediaSuccess();
      } catch (err) {
        handleUserMediaError();
      }
    };

    return (
        <div>
            <h1>Camera Component</h1>
            <button onClick={handleScanClick}>Scan</button>

            {isCameraAccessible && showWebcam? (
              <><h4>Webcam Feed</h4>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
              />
              </>
            ) : (
              <button onClick={requestCameraAccess}>Allow Camera Access</button>
            )}
            
            {/* {showWebcam && (
                <div>
                    <h2>Webcam Feed</h2>
                    <Webcam />
                </div>
            )} */}
        </div>
    );
};

export default CameraComponent;