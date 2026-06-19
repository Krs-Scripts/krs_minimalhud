import { Box } from "@mantine/core";
import { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";

export default function Cinematic() {
  const [active, setActive] = useState<boolean>(false);

  useNuiEvent<boolean>("setCinematic", setActive);

  const barStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "12vh",
    backgroundColor: "#000",
    pointerEvents: "none",
    zIndex: 100,
    transition: "transform 0.6s ease-in-out",
  };

  return (
    <>
      <Box
        style={{
          ...barStyle,
          top: 0,
          transform: active ? "translateY(0)" : "translateY(-100%)",
        }}
      />
      <Box
        style={{
          ...barStyle,
          bottom: 0,
          transform: active ? "translateY(0)" : "translateY(100%)",
        }}
      />
    </>
  );
}