import { useRef, useEffect, useState } from "react"
import '../index.css'

const API_KEY = "";
const PROJECT_URL = "";
const MODEL_VERSION = "";

export default function LiveFeed()  {

  const [enableCamText, setEnableCanText] = useState("Show Camera")
  const [garbageStatus, setGarbageStatus] = useState("Waiting for Garbage truck.",);
  const videoWidth = 360; //416
  const videoHeight = 360; //416
  const canvasRef = useRef(null)
  const streamSourceRef = useRef(null)
  var detectInterval = useRef(null);
  var model = undefined;

  const loadModel = async () => {
    await window.roboflow
      .auth({ publisharable_key: API_KEY, })
      .load({
        model: PROJECT_URL,
        version: MODEL_VERSION, onMetaData: function (m) { }
      })
      .then((ml) => {
        model = ml
      })
  }

  const showWebCam = async () => {
    const camPermissions = await enableCam(true);
    if (camPermissions) {
      await loadModel();
      await enableCam();
      startDetection();
    }
  }

  const startDetection = () => {
    if (model) {
      detectInterval.current = setInterval(() => {
        detect(model)
      }, 1000)
    }
  }
  const stopCamera = () => {
    if (
      streamSourceRef.current != null &&
      streamSourceRef.current.srcObject !== null) {
      streamSourceRef.current.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }
    stopDetection();
    //Stop detection
  };
    const stopDetection = async () => {
      clearInterval(detectInterval.current);
      //clear canvas when stop detecting
      setTimeout(() => {
        canvasRef.current.getContext("2d").clearRect(0, 0, 360, 360);
      }, 500);
    }

      const enableCam = (checkCamPermissions = false) => {
        const constraints = {
          video: {
            width: videoWidth,
            height: videoHeight,
            facingMode: "environment"
          }
        }

        return navigator.mediaDevices.getUserMedia(constraints).then(
          function (stream) {
            if (checkCamPermissions) {
              stream.getVideoTracks().forEach((track) => { track.stop(); });
              return true;
            } else {
              streamSourceRef.current.srcObject = stream;
              streamSourceRef.current.addEventListener("loadeddata", function () {
                return true;
              })
            }
          },
          (error) => {
            return false;
          },
        )
      }

      const detect = async (model) => {
        console.log("detect")
        if (typeof streamSourceRef.current != "undefined" && streamSourceRef.current !== null) {
          adjustCanvas(videoWidth, videoHeight);
          const detections = await model.detect(streamSourceRef.current);
          //console.log(detections)
          if (detections.length > 0) {
            detections.forEach((el) => {
              if (el.class = "garbagePickingUp" && el.confidence > 0.6) {
                setGarbageStatus("picking up garbage")
              } else {
                setGarbageStatus("Waiting for Garbage truck.")
              }
            });
          }

          const ctx = canvasRef.current.getContext("2d");
          drawBoxes(detections, ctx);
        }
      }


      const adjustCanvas = (w, h) => {
        canvasRef.current.width = w * window.devicePixelRatio;
        canvasRef.current.height = h * window.devicePixelRatio;
        canvasRef.current.style.width = w + "px";
        canvasRef.current.style.height = h + "px";
        canvasRef.current.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
      }
      const drawBoxes = (detections, ctx) => {
        detections.forEach((row) => {
          if (true) {
            //video
            var temp = row.bbox;
            temp.class =
              row.class === "GarbageBin"
                ? "bin"
                : row.class === "garbagePickingUp"
                  ? "pickup"
                  : row.class;
            temp.color = row.color;
            temp.confidence = row.confidence;
            row = temp;
          }
          if (row.confidence < 0) return;
          var x = row.x - row.width / 2;
          var y = row.y - row.height / 2;
          var w = row.width;
          var h = row.height;
          //box
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = row.color;
          ctx.rect(x, y, w, h);
          ctx.stroke();
          //shade
          ctx.fillStyle = "black";
          ctx.globalAlpha = 0.2;
          ctx.fillRect(x, y, w, h);
          ctx.globalAlpha = 1.0;
          //label
          var fontColor = "black";
          var fontSize = 12;
          ctx.font = `${fontSize}px monospace`;
          ctx.textAlign = "center";
          var classTxt = row.class;
          var confTxt = (row.confidence * 180).toFixed().toString + "%"
          var msgTxt = classTxt + " " + confTxt;
          const textHeight = fontSize;
          var textWidth = ctx.measureText(msgTxt).width;
          if (textHeight < h && textWidth <= w) {
            ctx.strokeStyle = row.color;
            ctx.fillStyle = row.color;
            ctx.fillRect(
              x - ctx.linewidth / 2,
              y - textHeight - ctx.linewidth,
              textWidth + 2, textHeight + 1,
            );
            ctx.stroke();
            ctx.fillStyle = fontColor;
            ctx.fillText(msgTxt, x + textWidth / 2 + 1, y - 1);
          } else {
            textWidth = ctx.measureText(confTxt).width;
            ctx.strokeStyle = row.color;
            ctx.fillStyle = row.color;
            ctx.fillRect(
              x - ctx.linewidth / 2,
              y - textHeight - ctx.linewidth,
              textWidth + 2,
              textHeight + 1);
            ctx.stroke();
            ctx.fillStyle = fontColor;
            ctx.fillText(confTxt, x + textWidth / 2 + 1, y - 1);
          }
        });
      };
      return (
        <div>
          <div>
            <button onClick={showWebCam} className="cam-button">

              {enableCamText}
            </button>
          </div>
          <button onClick={stopCamera}
          >
            Stop Cam
          </button>
          <h2>{garbageStatus}</h2>
          <div className="video-display-container">

            <div className="video-display">

              <canvas ref={canvasRef} className="prediction-window" />
              <video ref={streamSourceRef} autoPlay muted playsInline width={videoWidth} height={videoHeight} />

            </div>

          </div>

        </div>
      )
}


