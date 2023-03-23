import * as React from "react";
import { useContext } from "react";
import { Switch } from "./component/Switch";

const ToggleContext = React.createContext<any>(null);
ToggleContext.displayName = "ToggleContext";

function useToggle() {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error("useToggle must be within a <Toggle/>");
  }
  return context;
}

function Toggle({ children }: { children: React.ReactNode }): any {
  const [on, setOn] = React.useState<boolean>(false);
  const toggle = () => setOn(!on);
  const myValue = { on, toggle };

  return (
    <ToggleContext.Provider value={myValue}>{children}</ToggleContext.Provider>
  );
}

const ToggleOn = ({ children }: { children?: React.ReactNode }) => {
  const { on } = useToggle();
  return on ? (children as React.ReactElement) : null;
};

const ToggleOff = ({ children }: { children?: React.ReactNode }) => {
  const { on } = useToggle();
  return on ? null : (children as React.ReactElement);
};

const ToggleButton = (props: any): JSX.Element => {
  const { on, toggle } = useToggle();
  return <Switch on={on} onClick={toggle} {...props} />;
};

function CompoundPattern(): JSX.Element {
  return (
    <div>
      <Toggle>
        <ToggleOn>토글 on</ToggleOn>
        <ToggleOff>토글 off</ToggleOff>
        <div style={{ background: "red" }}>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  );
}

export default CompoundPattern;

/*
eslint
  no-unused-vars: "off",
*/
