import { createContext, useContext, useState } from "react";

const CountContext = createContext<any>(null);

function CountProvider(props: any) {
  const [count, setCount] = useState(0);
  const value = [count, setCount];
  return <CountContext.Provider value={value} {...props} />;
}

function useCount() {
  const context = useContext(CountContext);
  if (!context) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

function CountDisplay() {
  const [count] = useCount();
  return <div>{`The current count is ${count}`}</div>;
}

function Counter() {
  const [, setCount] = useCount();
  const increment = () => setCount((c: any) => c + 1);
  return <button onClick={increment}>Increment count</button>;
}
function ContextComponent() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  );
}

export default ContextComponent;
