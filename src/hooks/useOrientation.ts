import { useState } from "react";

export function useOrientation() {
  const [acceleration, setAcceleration] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [isGranted, setIsGranted] = useState(false);

  const handleOrientation = (event) => {
    setAcceleration({ ...event.acceleration });
  };

  const grant = () => {
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

  return { grant };
}
