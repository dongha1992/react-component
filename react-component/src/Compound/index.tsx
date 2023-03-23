import React, { useState, createContext, useMemo } from "react";

// Context api 상태 전달하기

const MediumClapContext = createContext({});
const { Provider } = MediumClapContext;

const Count = () => {
  return <div>count component</div>;
};

const Total = () => {
  return <div>Total component</div>;
};

const Icon = () => {
  return <div>Icon component</div>;
};

const MediumClap = ({ children, onClap }: any) => {
  const [clapState, setClapState] = useState({});

  const memoizedValue = useMemo(
    () => ({
      ...clapState,
    }),
    [clapState]
  );
  const handleClapClick = () => {};
  return (
    <Provider value={memoizedValue}>
      <button onClick={handleClapClick}>{children}</button>
    </Provider>
  );
};

MediumClap.Count = Count;
MediumClap.Total = Total;
MediumClap.Icon = Icon;

function Compound() {
  /* 기본 예제 */
  // const handleClap = () => {};
  // return (
  //   <MediumClap onClap={handleClap}>
  //     <MediumClap.Count></MediumClap.Count>
  //     <MediumClap.Total></MediumClap.Total>
  //     <MediumClap.Icon></MediumClap.Icon>
  //   </MediumClap>
  // );

  /* context api로 상태전달하기 */
  const handleClap = () => {};

  return (
    <MediumClap onClap={handleClap}>
      <MediumClap.Count></MediumClap.Count>
      <MediumClap.Total></MediumClap.Total>
      <MediumClap.Icon></MediumClap.Icon>
    </MediumClap>
  );
}

export default Compound;
