import { css } from "@emotion/react";

export function EnableCamera({ children, isOpen }: any) {
  return (
    <div
      css={css({
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        opacity: isOpen ? "100%" : "0",
        visibility: isOpen ? "visible" : "hidden",
        transition: ".5s",
        backgroundColor: "#242424",
        zIndex: 10000,
      })}
    >
      {children}
    </div>
  );
}
