import { createRoot } from "react-dom/client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Floor } from "../components/three/Floor";
import { OrbitControls } from "@react-three/drei";
import { Knife } from "../components/three/Knife";
import * as THREE from "three";
import io, { Socket as SocketClient } from "socket.io-client";
import { SOCKET_IO_URL } from "../const/url";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { css } from "@emotion/react";
import { EnableCamera } from "../components/ui/EnableCamera";
import { QRCodeBox } from "../components/ui/QRCode";

const socket = io(SOCKET_IO_URL, {
  query: { token: "a" },
  secure: true,
});

export function Scene() {
  const [acceleration, setAcceleration] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const [handLandmarker, setHandLandmarker] = useState<any>();

  const [userId, setUserId] = useState(Math.random());
  const [otherUserId, setOtherUserId] = useState(0);

  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
  const [position, setPosition] = useState(new THREE.Vector3(0, 1, 0));

  const [otherRotation, setOtherRotation] = useState(new THREE.Euler(0, 0, 0));
  const [otherPosition, setOtherPosition] = useState(
    new THREE.Vector3(0, 1, 2)
  );

  const [lastVideoTime, setLastVideoTime] = useState(-1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const cameraRef: any = useRef();

  const knifeRef: any = useRef();
  const setPeer = () => {
    let peerConnection: RTCPeerConnection;

    socket.emit("addUser", userId);

    socket.on("messageoffer", async (message) => {
      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };
      peerConnection = new RTCPeerConnection(configuration);

      peerConnection.addEventListener("datachannel", (event) => {
        const dataChannel = event.channel;
        dataChannel.addEventListener("message", (event) => {
          const message = event.data;
          const data = JSON.parse(message);

          setAcceleration({
            alpha: (data.alpha * Math.PI) / 180,
            beta: (data.beta * Math.PI) / 180,
            gamma: (data.gamma * Math.PI) / 180,
          });
        });
      });

      peerConnection.onicecandidate = (e) => {
        socket.emit("newIceCandidate", e.candidate);
      };

      peerConnection.setRemoteDescription(new RTCSessionDescription(message));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("iceCandidate", async (message) => {
      try {
        await peerConnection.addIceCandidate(message);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    });

    socket.on("nowUsers", async (userList) => {
      console.log(userList);
      for (let index = 0; index < userList.length; index++) {
        const targetId = userList[index];
        if (targetId != userId) {
          setOtherUserId(targetId);
        }
      }
    });

    socket.on("rcvData", async (targetId, targetPosition) => {
      if (targetId != userId) {
        setOtherPosition(
          new THREE.Vector3(
            targetPosition[0],
            targetPosition[1],
            targetPosition[2]
          )
        );
        console.log(targetId, targetPosition);
      }
    });
  };

  const handleResetUser = () => {
    socket.emit("reset");
  };

  const startNewCamera = () => {
    const videoElement: HTMLVideoElement = document.getElementById(
      "inputVideo"
    ) as HTMLVideoElement;

    const width = 720;
    const height = 480;

    const constraints = {
      video: {
        width: width,
        height: height,
      },
    };

    if (lastVideoTime != -1) {
      videoElement.play();
      return false;
    }

    setIsCameraOpen(true);

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (lastVideoTime != -1) {
        cameraRef.current.srcObject = stream;
        cameraRef.current.play();
      } else {
        cameraRef.current.srcObject = stream;
        cameraRef.current.play();

        cameraRef.current.addEventListener("loadeddata", renderLoop);
      }
    });
  };

  const initCam = async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );
    const handLandmarkerTemp = await HandLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
        minTrackingConfidence: 0.2,
      }
    );

    setHandLandmarker(handLandmarkerTemp);
  };

  const renderLoop = () => {
    window.requestAnimationFrame(renderLoop);

    const video: any = document.getElementById("video");
    let startTimeMs = performance.now();

    if (video.currentTime !== lastVideoTime) {
      try {
        const detections = handLandmarker.detectForVideo(video, startTimeMs);
        const x = detections.landmarks[0][0].x;
        const y = detections.landmarks[0][0].y;
        const z = detections.landmarks[0][0].z;

        const fx = -x * 2;
        const fy = 2 + (-y - 0.5);
        const fz = z;

        socket.emit("data", userId, [fx, fy, fz]);

        setPosition(new THREE.Vector3(fx, fy, fz));
      } catch (error) {}
    }
  };

  useEffect(() => {
    setPeer();
    initCam();
  }, []);

  useEffect(() => {
    try {
      setRotation(
        new THREE.Euler(
          acceleration.beta + Math.PI / 2,
          -acceleration.gamma,
          -acceleration.alpha
        )
      );
    } catch (error) {}
  }, [acceleration]);

  return (
    <>
      <video
        id="video"
        ref={cameraRef}
        width={720}
        height={480}
        css={css({
          position: "absolute",
          top: 0,
          left: 0,
        })}
      ></video>
      {isCameraOpen == false && (
        <EnableCamera>
          <QRCodeBox
            text={`https://front:5173/mobile?id=${userId}`}
          ></QRCodeBox>

          <button onClick={startNewCamera}>카메라</button>
        </EnableCamera>
      )}

      <button
        css={css({
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 9000,
        })}
        onClick={handleResetUser}
      >
        reset
      </button>

      <Canvas>
        <OrbitControls makeDefault />
        <color attach="background" args={["#ffffff"]} />

        <directionalLight
          castShadow
          position={[0, 10, 0]}
          intensity={4}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <Floor />

        {otherUserId != 0 && (
          <Knife
            ref={knifeRef}
            position={otherPosition}
            rotation={otherRotation}
          />
        )}

        <Knife ref={knifeRef} position={position} rotation={rotation} />
      </Canvas>
    </>
  );
}
