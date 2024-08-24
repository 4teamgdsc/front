import { css } from "@emotion/react";

export function Box({ children }: any) {
  return (
    <div
      css={css({
        padding: "1rem",
        borderRadius: "2rem",
        justifyContent: "center",
        display: "flex",
        backgroundColor: "#F7F7F729",
        flexDirection: "column",
        alignItems: "center",
        width: "200px",
      })}
    >
      {children}
    </div>
  );
}

export function LargeBox({ children }: any) {
  return (
    <div
      css={css({
        padding: "1rem",
        borderRadius: "2rem",
        justifyContent: "center",
        display: "flex",
        backgroundColor: "#F7F7F729",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
      })}
    >
      {children}
    </div>
  );
}
