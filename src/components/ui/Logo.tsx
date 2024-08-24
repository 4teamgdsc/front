import { css } from "@emotion/react";

export function Logo() {
  return (
    <b
      css={css({
        color: "#545454",
        fontSize: "24px",
        fontWeight: "700",
        fontStyle: "italic",
        position: "absolute",
        top: "1rem",
        left: "1rem",
        zIndex: 99999,
      })}
    >
      Swing
    </b>
  );
}
