import { useReducer, useRef, useState } from "react";
import { Switch } from "./component/Switch";
import { callAll } from "./utils";

const actionTypes: any = {
  toggle: "toggle",
  reset: "reset",
};

function toggleReducer(state: any, { type, initialState }: any) {
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

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
}: any = {}) {
  const { current: initialState } = useRef({ on: initialOn });
  const [state, dispatch] = useReducer(reducer, initialState) as any;

  const onIsControlled = controlledOn != null;
  const on = onIsControlled ? controlledOn : state.on;

  function dispatchWithOnChange(action: any) {
    if (!onIsControlled) {
      dispatch(action);
    }
    onChange?.(reducer({ ...state, on }, action), action);
  }

  const toggle = () => dispatchWithOnChange({ type: actionTypes.toggle });
  const reset = () =>
    dispatchWithOnChange({ type: actionTypes.reset, initialState });

  function getTogglerProps({ onClick, ...props }: any = {}) {
    return {
      "aria-pressed": on,
      onClick: callAll(onClick, toggle),
      ...props,
    };
  }

  function getResetterProps({ onClick, ...props }: any = {}) {
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

function Toggle({ on: controlledOn, onChange, initialOn, reducer }: any) {
  const { on, getTogglerProps } = useToggle({
    on: controlledOn,
    onChange,
    initialOn,
    reducer,
  });
  const props = getTogglerProps({ on });
  return <Switch {...props} />;
}

function ControlProps() {
  const [bothOn, setBothOn] = useState(false);
  const [timesClicked, setTimesClicked] = useState(0);

  function handleToggleChange(state: any, action: any) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return;
    }
    setBothOn(state.on);
    setTimesClicked((c) => c + 1);
  }

  function handleResetClick() {
    setBothOn(false);
    setTimesClicked(0);
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          클릭 초과했습니다
          <br />
        </div>
      ) : (
        <div data-testid="click-count">클릭수: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>리셋</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args: any) =>
            console.info("Uncontrolled Toggle onChange", ...args)
          }
        />
      </div>
    </div>
  );
}

export default ControlProps;
// we're adding the Toggle export for tests
export { Toggle };
