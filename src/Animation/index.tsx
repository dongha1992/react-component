import { ConstructionOutlined } from "@mui/icons-material";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import VanillaTilt from "vanilla-tilt";

function Tilt({ children }: { children: React.ReactElement }) {
  const tiltRef = useRef<any>(null);

  useEffect(() => {
    const tiltNode = tiltRef.current;
    if (tiltNode) {
      VanillaTilt.init(tiltNode, {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
      });
    }
    return function cleanup() {
      tiltNode?.vanillaTilt.destroy();
    };
  }, []);

  return (
    <TiltContainer ref={tiltRef} className="tilt-root">
      <TiltChild className="tilt-child">{children}</TiltChild>
    </TiltContainer>
  );
}

function VanillaTiltComponent() {
  return (
    <Tilt>
      <Center className="totally-centered">하이</Center>
    </Tilt>
  );
}

export default VanillaTiltComponent;

const TiltContainer = styled.div`
  height: 150px;
  background-color: red;
  width: 200px;
  background-image: -webkit-linear-gradient(315deg, #ff00ba 0%, #fae713 100%);
  background-image: linear-gradient(135deg, #ff00ba 0%, #fae713 100%);
  transform-style: preserve-3d;
  will-change: transform;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
`;

const TiltChild = styled.div`
  position: absolute;
  width: 50%;
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translateZ(30px) translateX(-50%) translateY(-50%);
  box-shadow: 0 0 50px 0 rgba(51, 51, 51, 0.3);
  background-color: white;
`;

const Center = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
