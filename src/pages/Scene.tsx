import { createRoot } from "react-dom/client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Floor } from "../components/three/Floor";
import { OrbitControls, Torus } from "@react-three/drei";
import { Knife } from "../components/three/Knife";
import * as THREE from "three";
import io, { Socket as SocketClient } from "socket.io-client";
import { SOCKET_IO_URL } from "../const/url";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { css } from "@emotion/react";
import { EnableCamera } from "../components/ui/EnableCamera";
import { QRCodeBox } from "../components/ui/QRCode";
import { Target } from "../components/three/Target";
import { Box } from "../components/ui/Box";
import { Button } from "../components/ui/Button";
import {
  CuboidCollider,
  euler,
  Physics,
  quat,
  RapierRigidBody,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import { TargetList } from "../components/three/TargetList";
import { useBackgroundStore } from "../store/backgroundColor";

import { keyframes } from "@emotion/react";
import { OptionTitle } from "../components/ui/Title";
import { Toggle } from "../components/ui/Toggle";
import { Logo } from "../components/ui/Logo";

const bounce = keyframes`
0% {
background-color: #ffffff;
}
50% {
background-color: #cf2929;
}
100% {
background-color: #ffffff;
}
`;

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
  const [isStart, setIsStart] = useState(false);

  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
  const [position, setPosition] = useState(new THREE.Vector3(0, 1, 0));
  const [cameraPosition, setCameraPosition] = useState(
    new THREE.Vector3(0, 1, 1)
  );

  const [topCameraPosition, setTopCameraPosition] = useState(
    new THREE.Vector3(0, 0, 1)
  );

  const [playerPosition, setPlayerPosition] = useState(0);

  const [otherRotation, setOtherRotation] = useState(new THREE.Euler(0, 0, 0));
  const [otherPosition, setOtherPosition] = useState(
    new THREE.Vector3(0, 1, 2)
  );

  const [cameraAsp, setCameraAsp] = useState(
    window.innerWidth / window.innerHeight
  );

  const rigidBody = useRef<RapierRigidBody>(null);

  const [lastVideoTime, setLastVideoTime] = useState(-1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const backgroundStore = useBackgroundStore();

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

    // socket.on("rcvData", async (targetId, targetPosition) => {
    //   if (targetId != userId) {
    //     setOtherPosition(
    //       new THREE.Vector3(
    //         targetPosition[0],
    //         targetPosition[1],
    //         targetPosition[2]
    //       )
    //     );
    //     console.log(targetId, targetPosition);
    //   }
    // });

    // socket.on("rcvDataRotation", async (targetId, targetRotation) => {
    //   if (targetId != userId) {
    //     setOtherRotation(
    //       new THREE.Euler(
    //         targetRotation[0],
    //         targetRotation[1],
    //         targetRotation[2]
    //       )
    //     );
    //   }
    // });
  };

  const handleResetUser = () => {
    socket.emit("reset");
  };

  const handleClickToggle = () => {
    startNewCamera();
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
      }
    });
  };

  const handleStart = () => {
    setIsStart(true);
    renderLoop();
    setCameraAsp(window.innerWidth / window.innerHeight);
  };

  useEffect(() => {
    console.log("AD", topCameraPosition.z);
  }, [topCameraPosition]);

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

    const speed = 0.005;

    const video: any = document.getElementById("video");
    let startTimeMs = performance.now();

    if (video.currentTime !== lastVideoTime) {
      try {
        const detections = handLandmarker.detectForVideo(video, startTimeMs);
        const x = detections.landmarks[0][0].x;
        const y = detections.landmarks[0][0].y;
        const z = detections.landmarks[0][0].z * 3;

        const fx = -x * 2;
        const fy = 2 + (-y - 0.5);
        const fz = z;

        socket.emit("data", userId, [fx, fy, fz]);

        setPosition((e) => new THREE.Vector3(fx, fy, e.z - speed));
        setCameraPosition(
          (e) =>
            new THREE.Vector3(
              fx - (0.2 + fx / 6),
              fy + (0.2 + fy / 10),
              e.z - speed
            )
        );

        // const position = vec3({
        //   x: fx,
        //   y: fy,
        //   z: fz,
        // });

        // rigidBody.current.setTranslation(position, true);
        // rigidBody.current.setRotation(quaternion, true);
      } catch (error) {}
    }
  };

  useEffect(() => {
    setPeer();
    initCam();
    setCameraAsp(window.innerWidth / window.innerHeight);
  }, []);

  useEffect(() => {
    try {
      socket.emit("dataRotation", userId, [
        acceleration.beta + Math.PI / 2,
        -acceleration.gamma,
        -acceleration.alpha,
      ]);

      setRotation(
        new THREE.Euler(
          acceleration.beta + Math.PI / 2,
          -acceleration.gamma,
          -acceleration.alpha
        )
      );
    } catch (error) {}
  }, [acceleration]);

  //   useEffect(() => {
  //     if (backgroundStore.color != "#ffffff") {
  //       const audioElement: any = document.getElementById("sound");
  //       audioElement.play();
  //     }
  //   }, [backgroundStore.color]);

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
      <audio
        css={css({
          position: "absolute",
          top: 0,
          left: 0,
        })}
        src="/sound/target.mp3"
        id="sound"
      ></audio>

      <EnableCamera isOpen={!isStart}>
        <div
          css={css({
            display: "flex",
            flexDirection: "row",
            gap: "1.5rem",
          })}
        >
          <Box>
            <DotLabel>1</DotLabel>
            <QRCodeBox
              text={`https://front:5173/mobile?id=${userId}`}
            ></QRCodeBox>
            <OptionTitle>핸드폰으로 QR코드를 인식해주세요</OptionTitle>
          </Box>

          <Box>
            <DotLabel>2</DotLabel>

            <div
              css={css({
                marginTop: "2rem",
              })}
            >
              <Toggle checked={isCameraOpen} onClick={startNewCamera}>
                PC캠 활성화하기
              </Toggle>
            </div>

            <OptionTitle>카메라 권한을 활성화해 주세요.</OptionTitle>
          </Box>

          <Box>
            <DotLabel>3</DotLabel>

            <img src="/image/notebook.png" width={64} height={64}></img>
            <OptionTitle>
              핸드폰 화면이 정면을 보도록 위치시켜주세요
            </OptionTitle>
          </Box>
        </div>

        <div
          css={css({
            marginTop: "3rem",
          })}
        >
          <Button onClick={handleStart}>준비완료</Button>
        </div>
      </EnableCamera>

      <Logo />

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
        <color attach="background" args={[backgroundStore.color]} />
        <Camera
          position={cameraPosition}
          fov={45}
          aspect={cameraAsp}
          near={0.1}
        />

        {/* <OrbitControls /> */}

        <Suspense>
          <Physics>
            <CuboidCollider position={[0, -1, 0]} args={[20, 1, 60]} />

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
            <TargetList />

            <Floor />

            {/* {otherUserId != 0 && (
          <Knife
            ref={knifeRef}
            position={otherPosition}
            rotation={otherRotation}
          />
        )} */}

            <RigidBody
              type="kinematicPosition"
              ref={rigidBody}
              colliders={"cuboid"}
              position={position}
              rotation={rotation}
            >
              <Knife ref={knifeRef} />
              {/* rotation={rotation}  */}
            </RigidBody>
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

const Camera = (props) => {
  const ref: any = useRef();
  const set = useThree((state) => state.set);
  useEffect(() => void set({ camera: ref.current }), []);
  useFrame(() => ref.current.updateMatrixWorld());
  return <perspectiveCamera ref={ref} {...props} />;
};

const DotLabel = ({ children }: any) => {
  return (
    <div
      css={css({
        position: "absolute",
        top: "1rem",
        left: "1rem",
        backgroundColor: "#F7F7F720",
        borderRadius: "40px",
        width: "26px",
        height: "26px",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      })}
    >
      <b
        css={css({
          fontWeight: "400",
          color: "#C1C1C1",
        })}
      >
        {children}
      </b>
    </div>
  );
};
