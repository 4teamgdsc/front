import { css } from "@emotion/react";
import { OptionTitle } from "../components/ui/Title";
import { LargeBox } from "../components/ui/Box";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/ui/Logo";

export function ResultPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    location.href = "/scene";
  };
  return (
    <div
      css={css({
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",

        backgroundColor: "#242424",
        gap: "2rem",
      })}
    >
      <Logo />

      <OptionTitle>두구두구.. 오뚜기님의 타율은..?</OptionTitle>

      <LargeBox>
        <Item keyn={"현재"} value={"80%"} />
        <Item keyn={"소모한 칼로리"} value={"130kcal"} />
        <Item keyn={"획득한 코인"} value={"20c"} />
      </LargeBox>

      <Button onClick={handleClick}>다시 대결하기</Button>
    </div>
  );
}

function Item({ keyn, value }: any) {
  return (
    <div
      css={css({
        display: "flex",
        justifyContent: "space-between",
        width: "90%",
      })}
    >
      <p
        css={css({
          color: "#fff",
        })}
      >
        {keyn}
      </p>

      <p
        css={css({
          color: "#fff",
        })}
      >
        {value}
      </p>
    </div>
  );
}
