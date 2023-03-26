import { useRef, useEffect, useState } from "react";
import "./App.css";
import * as faceapi from "face-api.js";
import { makeDecision } from "./helpers/decisions";
// Neutral 0.9928847551345825
function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [expressions, setExpressions] = useState([]);
  var count = 0;

  useEffect(() => {
    startVideo();

    videoRef && loadModels();
    const songs = makeDecision("happy");
    Promise.all(songs).then(values => {
      console.log(values.filter(x => x));
    });
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
      .then(currentStream => {
        videoRef.current.srcObject = currentStream;
      })
      .catch(err => {
        console.error(err);
      });
  };

  const averageAllEmotions = () => {
    var angry = 0;
    var happy = 0;
    var sad = 0;
    var neutral = 0;
    var surprised = 0;
    var fearful = 0;
    var maxEmotionName = null;
    // var disgusted = 0;
    for (var i = 0; i < expressions.length; i++) {
      angry += expressions[i][0];
    }
    angry /= expressions.length;

    for (var i = 0; i < expressions.length; i++) {
      happy += expressions[i][1];
    }
    happy /= expressions.length;

    for (var i = 0; i < expressions.length; i++) {
      sad += expressions[i][2];
    }
    sad /= expressions.length;

    for (var i = 0; i < expressions.length; i++) {
      neutral += expressions[i][3];
    }
    neutral /= expressions.length;

    for (var i = 0; i < expressions.length; i++) {
      surprised += expressions[i][4];
    }
    surprised /= expressions.length;

    for (var i = 0; i < expressions.length; i++) {
      fearful += expressions[i][5];
    }
    fearful /= expressions.length;
    const emotions = {
      sad: sad,
      happy: happy,
      angry: angry,
      surprised: surprised,
      fearful: fearful,
      neutral: neutral,
    };
    const maxEmotionValue = Math.max(...Object.values(emotions));
    for (const x in emotions) {
      if (emotions[x] === maxEmotionValue) {
        maxEmotionName = x;
        break;
      }
    }
    console.log(maxEmotionName);
    console.log(maxEmotionValue);

    console.log("emotions", emotions);
    /// [[]sa]
  };

  const faceDetection = async () => {
    const faceDetectionInterval = setInterval(async () => {
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

    setTimeout(() => {
      clearInterval(faceDetectionInterval);
      averageAllEmotions();
      console.log("emotion", averageAllEmotions());
    }, 3500);
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
    </div>
  );
}

export default App;
