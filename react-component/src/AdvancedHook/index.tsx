import { useReducer } from "react";

// const counterReducer = (state: any, action: any) => {
//   return {
//     ...state,
//     ...(typeof action === "function" ? action(state) : action),
//   };
// };

/* 리덕스 스타일 */

type Action = { type: "INCREMENT"; step: number };

type State = {
  count: number;
};

const counterReducer = (state: State, action: Action) => {
  const { type, step } = action;
  switch (action.type) {
    case "INCREMENT": {
      return { count: state.count + action.step };
    }
    default: {
      throw new Error(`Unsupported action type: ${type}`);
    }
  }
};

function CounterButton({ initialCount = 0, step = 1 }) {
  const [state, dispatch] = useReducer(counterReducer, {
    count: initialCount,
  });

  const { count } = state;

  const increment = () => dispatch({ type: "INCREMENT", step });
  return <button onClick={increment}>{count}</button>;
}

function Counter() {
  return <CounterButton />;
}

export default Counter;
