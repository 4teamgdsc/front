import { css } from "@emotion/react";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div
      css={css({
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
      })}
    >
      dd
    </div>
  );
}

export default App;
