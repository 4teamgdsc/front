import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";

type ToggleType = {
  children?: any;
  onClick?: any;
  checked?: boolean;
  disabled?: boolean;
};

export function Toggle({
  children,
  checked,
  onClick,
  disabled = false,
}: ToggleType) {
  const handleClick = (e: any) => {
    if (disabled) {
      return 0;
    }
    onClick(e);
  };

  return (
    <div
      onClick={handleClick}
      css={css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "1rem",
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: "0.9rem",
        flexGrow: 0,
        flexShrink: 0,
        cursor: "pointer",
        padding: "0.5rem 0.85rem",
        backgroundColor: "#F7F7F729",
        borderRadius: "16px",
      })}
    >
      <p
        css={css({
          fontSize: "0.8rem",
          color: "#fff",
          margin: 0,
        })}
      >
        {children}
      </p>
      <div
        css={css({
          position: "relative",
          width: "28px",
          minWidth: "28px",
          height: "1rem",
          borderRadius: "2rem",
          backgroundColor: checked ? "#88FC01" : "#dedee3",
          transition: "1s",
        })}
      >
        <div
          css={css({
            position: "absolute",
            top: "2px",
            left: checked ? "14px" : "2px",
            width: "12px",
            height: "12px",
            borderRadius: "3rem",
            backgroundColor: "#ffffff",
            transition: "0.3s",
            boxShadow: "0 1px 5px #93949e60",
          })}
        ></div>
      </div>
    </div>
  );
}
