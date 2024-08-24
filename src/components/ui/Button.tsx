import { css } from "@emotion/react";

export function Button(props: any) {
  return (
    <button
      {...props}
      css={css({
        backgroundColor: "#88FC01",
        color: "#000",
        padding: "0.95rem 4rem",
        border: "none",
        outline: "none",
        borderRadius: "100px",
        fontWeight: "600",
        cursor: "pointer",
      })}
    >
      {props.children}
    </button>
  );
}
