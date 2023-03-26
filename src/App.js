import { useRef, useEffect, useState } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import { Card, Container, Row } from "react-bootstrap";
import * as faceapi from "face-api.js";
import SongCard from "./components/playlistTable/SongCard";
import { makeDecision } from "./helpers/decisions";
import { type } from "@testing-library/user-event/dist/type";

const CLIENT_ID = "6d0de60304354fedb5667d4673efdd41";
const CLIENT_SECRET = "b6358f2e564e4d10931ea62d63d06558";
const REDIRECT_URI = "http://localhost:3000/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [expressions, setExpressions] = useState([]);
  const [start, setStart] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [authPerms, setAuthPerms] = useState("");

  const [isHover, setIsHover] = useState(false);
  const [isHover2, setIsHover2] = useState(false);
  const [isHover3, setIsHover3] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const Enter1 = () => {
    setIsHover2(true)
  }
  const Leave1 = () => {
    setIsHover2(false);
  }

  const Enter2 = () => {
    setIsHover3(true);
  }
  const Leave2 = () => {
    setIsHover3(false);
  }

  // useEffect(() => {
    // var authParams = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body:
    //     "grant_type=client_credentials&client_id=" +
    //     CLIENT_ID +
    //     "&client_secret=" +
    //     CLIENT_SECRET,
    // };
    // fetch("https://accounts.spotify.com/api/token", authParams)
    //   .then(result => result.json())
    //   .then(data => {
    //     console.log("data", data)
    //     setAccessToken(data.access_token)
    //   });
  // }, []);

  // useEffect(() => {
  //   search();
  // }, [emotion]);

  // const search = async () => {
  //   console.log("before", emotion);
  //   var parameters = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + accessToken,
  //     },
  //   };
  //   var ID = await fetch(
  //     "https://api.spotify.com/v1/browse/categories/" + emotion + '/playlists',
  //     parameters
  //   )
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data);
  //       // setTracks(data.tracks.items);
  //     });
  // };

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

  const stopVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: false })
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
    // console.log("angry", angry);

    for (var i = 0; i < expressions.length; i++) {
      happy += expressions[i][1];
    }
    happy /= expressions.length;
    // console.log("happy", happy);

    for (var i = 0; i < expressions.length; i++) {
      sad += expressions[i][2];
    }
    sad /= expressions.length;
    // console.log("sad", sad);

    for (var i = 0; i < expressions.length; i++) {
      neutral += expressions[i][3];
    }
    neutral /= expressions.length;
    // console.log("neutral", neutral);

    for (var i = 0; i < expressions.length; i++) {
      surprised += expressions[i][4];
    }
    surprised /= expressions.length;
    // console.log("surprised", surprised);

    for (var i = 0; i < expressions.length; i++) {
      fearful += expressions[i][5];
    }
    fearful /= expressions.length;
    // console.log("fearful", fearful);
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
    console.log("maxEmotionName", maxEmotionName);
    console.log("maxEmotionName", maxEmotionValue);
    setEmotion(maxEmotionName);
    setStart(false);
    return {
      maxName: maxEmotionName,
      maxValue: maxEmotionValue,
    };
  };

  const handleCreatePlaylist = async() => {
    var parameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    data: {
      'name': 'New Playlist',
      "description": "New playlist description",
      "public": false
    }
    };
    var ID = await fetch(
      "https://api.spotify.com/v1/users/" + authPerms + "/playlists",
      parameters
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // setTracks(data.tracks.items);
      });
  }

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
      // console.log("--------------------------------------------------------------------");
      // console.log("Happy", detections.expressions.happy);
      // console.log("Sad", detections.expressions.sad);
      // console.log("Neutral", detections.expressions.neutral);
      // console.log("Angry", detections.expressions.angry);
      // console.log("Surprised", detections.expressions.surprised);
      // console.log("Fearful", detections.expressions.fearful);
      // console.log("Disgusted", detections.expressions.disgusted);
      // console.log("--------------------------------------------------------------------");
      expressions.push([
        detections.expressions.angry,
        detections.expressions.happy,
        detections.expressions.sad,
        detections.expressions.neutral,
        detections.expressions.surprised,
        detections.expressions.fearful,
        detections.expressions.disgusted,
      ]);
      // console.log((detections.expressions.angry + detections.expressions.happy + detections.expressions.sad + detections.expressions.neutral + detections.expressions.surprised + detections.expressions.fearful + detections.expressions.disgusted))
      // console.log(detections);

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    }, 500);

    setTimeout(async () => {
      clearInterval(faceDetectionInterval);
      const avg = averageAllEmotions();
      console.log("average", avg);
      const songs = await makeDecision(avg.maxName);
      console.log("song", songs);
      setTracks(songs);
    }, 6000);
  };

  const startScan = () => {
    setTracks([]);
    setExpressions([]);
    setStart(true);
    startVideo();
    setEmotion("None");

    videoRef && loadModels();
  };
  return (
    <div className="app">
      <div style={{ paddingBottom: 100 }}>
        <h1 style={{ textAlign: "center", color: "#1DB954" }}>MOODIFY</h1>
        {start ? (
          <div className="app__video">
            <video
              crossOrigin="anonymous"
              ref={videoRef}
              style={{
                border: "1px solid",
                borderImageSlice: 1,
                borderWidth: "10px",
                borderImageSource: "linear-gradient(#00C853, #fff345)",
                width: "940px",
                height: "650px",
              }}
              autoPlay
            ></video>
            <canvas
              ref={canvasRef}
              width="940"
              height="650"
              className="app__canvas"
            />
          </div>
        ) : (
          <div
            style={{
              alignContent: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
              <button
                style={{
                  width: 200,
                  height: 50,
                  backgroundColor: isHover2 ? "#32d16a" : "#1DB954",
                  borderRadius: 50,
                  padding: "auto",
                  color: "#fff",
                  fontFamily: "Ubuntu",
                  scale: isHover2 ? "1.1" : "1",
                  transition: "all .2s ease-in-out",
                  marginRight: 50
                }}
                onClick={() => {window.location.replace(`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`)}}
                onMouseEnter={Enter1}
                onMouseLeave={Leave1}
              >
                Sign In
              </button>
            <button
              style={{
                width: 200,
                height: 50,
                backgroundColor: isHover ? "#32d16a" : "#1DB954",
                borderRadius: 50,
                padding: "auto",
                color: "#fff",
                fontFamily: "Ubuntu",
                scale: isHover ? "1.1" : "1",
                transition: "all .2s ease-in-out",
              }}
              onClick={startScan}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Start Scan
            </button>
          </div>
        )}
        <p style={{ color: "#fff", fontFamily: "Ubuntu", textAlign: "center" }}>
          Emotion: {emotion}
        </p>
      </div>
      <div>
        <SongCard songs={tracks} />
        {/* <button
          style={{
            width: 200,
            height: 50,
            backgroundColor: isHover3 ? "#32d16a" : "#1DB954",
            borderRadius: 50,
            padding: "auto",
            color: "#fff",
            fontFamily: "Ubuntu",
            scale: isHover3 ? "1.1" : "1",
            transition: "all .2s ease-in-out",
          }}
          onClick={handleCreatePlaylist}
          onMouseEnter={Enter2}
          onMouseLeave={Leave2}
        >
          Create Playlist
        </button> */}
        {/* <Container>
          <Row className="mx-2 row row-cols-4">
            {tracks.map((track, i) => {
              return (
                <Card>
                  <Card.Img src={track.album.images[0].url} />
                  <Card.Body>
                    <Card.Title>{track.name}</Card.Title>
                  </Card.Body>
                </Card>
              );
            })}
          </Row>
        </Container> */}
      </div>
    </div>
  );
}

export default App;
