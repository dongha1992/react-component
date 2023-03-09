import { createContext, useContext, useState } from "react";

const CountContext = createContext<any>(null);

function CountProvider(props: any) {
  const [count, setCount] = useState(0);
  const value = [count, setCount];
  // could also do it like this:
  // const value = React.useState(0)
  return <CountContext.Provider value={value} {...props} />;
}

function CountDisplay() {
  const [count] = useContext(CountContext);
  return <div>{`The current count is ${count}`}</div>;
}

function Counter() {
  const [, setCount] = useContext(CountContext);
  const increment = () => setCount((c: number) => c + 1);
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
