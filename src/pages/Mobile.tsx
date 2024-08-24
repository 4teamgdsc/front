import { useEffect, useState } from "react";
import io, { Socket as SocketClient } from "socket.io-client";
import { SOCKET_IO_URL } from "../const/url";
import { css } from "@emotion/react";
import { Button } from "../components/ui/Button";
import { OptionTitle } from "../components/ui/Title";
import { Logo } from "../components/ui/Logo";

const socket = io(SOCKET_IO_URL, {
  query: { token: "a" },
  secure: true,
});

export function Mobile() {
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | any>();
  const [acceleration, setAcceleration] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [isGranted, setIsGranted] = useState(false);

  const makeCall = async () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(configuration);
    const connectDataChannel = peerConnection.createDataChannel("data");
    setDataChannel(connectDataChannel);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("offer", offer);

    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.emit("newIceCandidate", event.candidate);
      }
    });

    peerConnection.addEventListener("connectionstatechange", (event) => {
      if (peerConnection.connectionState === "connected") {
        console.log("connected");
      }
    });

    socket.on("iceCandidate", async (message) => {
      try {
        await peerConnection.addIceCandidate(message);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    });

    socket.on("message", async (message) => {
      const remoteDesc = new RTCSessionDescription(message);
      await peerConnection.setRemoteDescription(remoteDesc);
    });
  };

  const handleOrientation = (event) => {
    setIsGranted(true);
    setAcceleration({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
  };

  const handleClickGrant = () => {
    const DeviceOrientationEvent: any = window.DeviceOrientationEvent;
    const DeviceMotionEvent: any = window.DeviceMotionEvent;
    const isSafariOver13 =
      window.DeviceOrientationEvent !== undefined &&
      typeof DeviceOrientationEvent.requestPermission === "function";

    if (isSafariOver13) {
      DeviceMotionEvent.requestPermission()
        .then((state: any) => {
          if (state === "granted") {
            setIsGranted(true);
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch((e: any) => {
          console.error(e);
        });
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
  };

  useEffect(() => {
    try {
      dataChannel.send(
        JSON.stringify({
          ...acceleration,
        })
      );
    } catch (error) {}
  }, [acceleration]);

  useEffect(() => {
    makeCall();
  }, []);

  return (
    <div
      css={css({
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",

        backgroundColor: "#242424",
      })}
    >
      <Logo />

      {isGranted == false ? (
        <>
          <OptionTitle>모션인식 권한을 허용해주세요</OptionTitle>
          <Button onClick={handleClickGrant}>허용하기</Button>
        </>
      ) : (
        <OptionTitle>허용되었어요</OptionTitle>
      )}

      {/* <p>{Math.round(acceleration.alpha)}</p>
      <p>{Math.round(acceleration.beta)}</p>
      <p>{Math.round(acceleration.gamma)}</p> */}
    </div>
  );
}
