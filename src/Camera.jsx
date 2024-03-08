import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import redlist from './redlist.json';
import Tesseract from "tesseract.js";

const CameraComponent = ({ theme, changeTheme }) => {
    const [showWebcam, setShowWebcam] = useState(false);
    const webcamRef = useRef(null);
    const [foundChemicals, setFoundChemicals] = useState([]);
    const [isCameraAccessible, setIsCameraAccessible] = useState(true);
    const [detText, setDetText] = useState("");
    const videoConstraints = {
      facingMode: { exact: "environment" }
    };

    useEffect(() => {
      const searchForChemicals = () => {
        const text = detText.toLowerCase();
        const matchingChemicals = Object.keys(redlist).filter(chemical => text.includes(chemical.toLowerCase()));
        setFoundChemicals(matchingChemicals);
      };
      searchForChemicals();
    }, [detText]);

    const keywords = ["Ingredients", "Includes"];
    const extractTextAfterKeyword = (text) => {
      for (const keyword of keywords) {
          const index = text.toLowerCase().indexOf(keyword.toLowerCase());
          if (index !== -1) {
              return text.substring(index + keyword.length).trim();
          }
      }
      return text;
  };

    const handleScanClick = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        Tesseract.recognize(imageSrc, "eng")
          .then(({ data: { text } }) => {
            console.log("Detected text:", text);
            const modifiedText = extractTextAfterKeyword(text);
            console.log("Modified Detected text:", modifiedText);
            setDetText(modifiedText);
          })
          .catch((error) => {
            console.error("Error performing OCR:", error);
          });
      }
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
        setShowWebcam(true);
      } catch (err) {
        handleUserMediaError();
      }
    };

    return (
      <div className={`container ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
        <h1>Gredo</h1>
        {foundChemicals && foundChemicals.length > 0 && (
          <div className="text-view">
              <h4>Found Chemicals:</h4>
              <table>
                  <thead>
                      <tr>
                          <th>Chemical</th>
                          <th>Description</th>
                      </tr>
                  </thead>
                  <tbody>
                      {foundChemicals.map(chemical => (
                          <tr key={chemical}>
                              <td style={{ color: redlist[chemical].threat }}>
                                  {chemical}
                              </td>
                              <td>{redlist[chemical].description}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
            <div className="text-view">
              {detText && (
                <div>
                  <h4>Detected Text:</h4>
                  <p>{detText}</p>
                </div>
              )}
            </div>
            {isCameraAccessible && showWebcam? (
              <>
              <div className="webcam-container">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={640}
                    height={480}
                    videoConstraints={videoConstraints}
                    className="rounded-webcam"
                />
              </div>
              <button className="g-button" onClick={handleScanClick}>Scan</button>
              </>
            ) : (
              <button className="g-button" onClick={requestCameraAccess}>Allow Camera Access</button>
            )}
        </div>
    );
};

export default CameraComponent;