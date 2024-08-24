import { css } from "@emotion/react";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [acceleration, setAcceleration] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [isGranted, setIsGranted] = useState(false);

  const handleClick = () => {
    setIsPlay(true);
  };

  const handleOrientation = (event) => {
    setAcceleration({ ...event.acceleration });
  };

  const handleButtonClick = () => {
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
    if (isPlay) {
      setInterval(() => {
        const audioElement: any = document.getElementById("sound");
        audioElement.play();
      }, 2000);
    }
  }, [isPlay]);

  return (
    <div
      css={css({
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
      })}
    >
      <button></button>
      <button onClick={handleClick}>플레이</button>
      <button onClick={handleButtonClick}>dvfsd</button>
      <audio src="/sound/target.mp3" id="sound"></audio>
      <p
        css={css({
          color: "#fff",
        })}
      >
        {acceleration.alpha}
      </p>
      dd
    </div>
  );
}

export default App;
