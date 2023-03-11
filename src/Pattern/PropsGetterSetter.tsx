import * as React from "react";
import { Switch } from "./component/Switch";
import { callAll } from "./utils";

type FunctionType = (...args: any[]) => void;

interface IGetTogglerProps {
  onClick?: FunctionType;
  [key: string]: any;
}

function useToggle() {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);

  function getTogglerProps({ onClick, ...props }: IGetTogglerProps = {}) {
    return {
      "aria-pressed": on,
      onClick: callAll(onClick, toggle),
      ...props,
    };
  }

  return {
    on,
    toggle,
    getTogglerProps,
  };
}

function PropsGetterSetter() {
  const { on, getTogglerProps } = useToggle();

  return (
    <div>
      <Switch {...getTogglerProps({ on })} />
      <hr />
      <button
        {...getTogglerProps({
          "aria-label": "custom-button",
          onClick: () => console.log("클릭했을 때 다른 일"),
        })}
      >
        {on ? "on" : "off"}
      </button>
    </div>
  );
}

export default PropsGetterSetter;
