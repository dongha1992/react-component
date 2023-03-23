import * as React from "react";
import { useReducer, useRef, useState } from "react";
import { Switch } from "./component/Switch";
import { callAll } from "./utils";

type FunctionType = (...args: any[]) => void;

interface IGetTogglerProps {
  onClick?: FunctionType;
  [key: string]: any;
}

const actionTypes = {
  toggle: "toggle",
  reset: "reset",
};

function toggleReducer(state: any, { type, initialState }: any): any {
  switch (type) {
    case actionTypes.toggle: {
      return { on: !state.on };
    }
    case actionTypes.reset: {
      return initialState;
    }
    default: {
      throw new Error(`Unsupported type: ${type}`);
    }
  }
}

function useToggle({ initialOn = false, reducer = toggleReducer } = {}) {
  const { current: initialState } = useRef({ on: initialOn });
  const [state, dispatch] = useReducer(reducer, initialState);
  const { on } = state;

  const toggle = () => dispatch({ type: actionTypes.toggle });
  const reset = () => dispatch({ type: actionTypes.reset, initialState });

  function getTogglerProps({ onClick, ...props }: IGetTogglerProps = {}) {
    return {
      "aria-pressed": on,
      onClick: callAll(onClick, toggle),
      ...props,
    };
  }

  function getResetterProps({ onClick, ...props }: IGetTogglerProps = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    };
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  };
}

function StateReducer() {
  const [timesClicked, setTimesClicked] = useState(0);
  const clickedTooMuch = timesClicked >= 4;

  function toggleStateReducer(state: any, action: any) {
    if (action.type === actionTypes.toggle && clickedTooMuch) {
      return { on: state.on };
    }
    return toggleReducer(state, action);
  }

  const { on, getTogglerProps, getResetterProps } = useToggle({
    reducer: toggleStateReducer,
  });

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: clickedTooMuch,
          on: on,
          onClick: () => setTimesClicked((count) => count + 1),
        })}
      />
      {clickedTooMuch ? (
        <div data-testid="notice">
          클릭을 너무 많이 했아요.
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({ onClick: () => setTimesClicked(0) })}>
        리셋
      </button>
    </div>
  );
}

export default StateReducer;
