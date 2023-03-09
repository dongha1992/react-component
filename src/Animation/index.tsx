import React, { useRef } from "react";
import VanillaTilt from "vanilla-tilt";

function Tilt({ children }: { children: React.ReactElement }) {
  const tiltRef = useRef<HTMLDivElement>(null);
  return <>{children}</>;
}

function VanillaTiltComponent() {
  return (
    <div>
      <Tilt>
        <div>하이</div>
      </Tilt>
    </div>
  );
}

export default VanillaTiltComponent;
