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

        backgroundColor: "#fff",
        zIndex: 10000,
      })}
    >
      {children}
    </div>
  );
}
