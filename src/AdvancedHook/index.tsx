import { useState } from "react";

function CounterButton({ initialCount = 0, step = 1 }) {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(count + step);
  return <button onClick={increment}>{count}</button>;
}

function Counter() {
  return <CounterButton />;
}

export default Counter;
