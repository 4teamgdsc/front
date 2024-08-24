import { css } from "@emotion/react";

export function EnableCamera({ children }: any) {
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

        backgroundColor: "#242424",
        zIndex: 10000,
      })}
    >
      {children}
    </div>
  );
}
