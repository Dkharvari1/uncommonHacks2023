import { useRef, useEffect, useState } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import * as faceapi from "face-api.js";
import SongCard from "./components/playlistTable/SongCard";


function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [expressions, setExpressions] = useState([]);

  useEffect(() => {
    startVideo();

    videoRef && loadModels();
  }, []);

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      faceDetection();
    });
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const faceDetection = async () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });
      console.log(
        "--------------------------------------------------------------------"
      );
      console.log("Happy", detections.expressions.happy);
      console.log("Sad", detections.expressions.sad);
      console.log("Neutral", detections.expressions.neutral);
      console.log("Angry", detections.expressions.angry);
      console.log("Surprised", detections.expressions.surprised);
      console.log("Fearful", detections.expressions.fearful);
      console.log("Disgusted", detections.expressions.disgusted);
      console.log(
        "--------------------------------------------------------------------"
      );
      expressions.push([
        detections.expressions.angry,
        detections.expressions.happy,
        detections.expressions.sad,
        detections.expressions.neutral,
        detections.expressions.surprised,
        detections.expressions.fearful,
        detections.expressions.disgusted,
      ]);
      console.log(
        detections.expressions.angry +
          detections.expressions.happy +
          detections.expressions.sad +
          detections.expressions.neutral +
          detections.expressions.surprised +
          detections.expressions.fearful +
          detections.expressions.disgusted
      );
      console.log(detections);

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    }, 1000);
  };

  return (
    <div className="app">
      <h1> AI FACE DETECTION</h1>
      <div className="app__video">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
      <canvas
        ref={canvasRef}
        width="940"
        height="650"
        className="app__canvas"
      />
      <SongCard/>
    </div>
  );
}

export default App;
