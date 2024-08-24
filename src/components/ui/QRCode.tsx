import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { css } from "@emotion/react";

function QRCodeBox({ text }: any) {
  const canvasRef = useRef<any>();

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, text, function (error) {
      if (error) console.error(error);
      //console.log('success!');
    });
  }, [text]);

  return <canvas ref={canvasRef}></canvas>;
}

export { QRCodeBox };
