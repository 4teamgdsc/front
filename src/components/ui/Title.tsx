import { css } from "@emotion/react";

export const OptionTitle = ({ children }: any) => {
  return (
    <p
      css={css({
        color: "#fff",
        textAlign: "center",
      })}
    >
      {children}
    </p>
  );
};
