import { createRoot } from "react-dom/client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Floor } from "../components/three/Floor";
import { OrbitControls } from "@react-three/drei";
import { Knife } from "../components/three/Knife";
import * as THREE from "three";
import io, { Socket as SocketClient } from "socket.io-client";
import { SOCKET_IO_URL } from "../const/url";

const socket = io(SOCKET_IO_URL, {
  query: { token: "a" },
  secure: true,
});

function Box(props) {
  // This reference will give us direct access to the mesh
  const meshRef: any = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export function Scene() {
  const [acceleration, setAcceleration] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));

  const knifeRef: any = useRef();
  const setPeer = () => {
    let peerConnection: RTCPeerConnection;

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

      //this.peerConnection.ontrack = e => remoteVideo.srcObject = e.streams[0];
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
  };

  useEffect(() => {
    setPeer();
    socket.emit("test", "d");
  }, []);

  useEffect(() => {
    try {
      console.log((acceleration.alpha * Math.PI) / 180);

      setRotation(
        new THREE.Euler(
          acceleration.gamma,
          acceleration.alpha,
          acceleration.alpha
        )
      );

      //   knifeRef.current.rotation.x = acceleration.alpha;
      //   knifeRef.current.rotation.y = acceleration.beta;
      //   knifeRef.current.rotation.z = acceleration.gamma;
    } catch (error) {}
  }, [acceleration]);

  return (
    <Canvas>
      <OrbitControls makeDefault />

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

      <Knife
        ref={knifeRef}
        position={new THREE.Vector3(0, 1, 0)}
        rotation={rotation}
      />
    </Canvas>
  );
}
