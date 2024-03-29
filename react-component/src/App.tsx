import { useRef } from "react";
import "./App.css";
import FastForm from "./FastForm";
import Compound from "./Compound";
import RenderProps from "./RenderProps";
import RenderPropsAndCompound from "./RenderProps/example";
import SuspenseTest from "./Suspense";
import Login from "./Auth";
import VanillaTiltComponent from "./Animation";
import Pokemon from "./Async";
import Counter from "./AdvancedHook";
// import ContextComponent from "./AdvancedHook/AboutContext";
// import Cache from "./Cache";
// import AboutLayoutEffect from "./AdvancedHook/AboutLayoutEffect";
// import AboutImperative from "./AdvancedHook/AboutImperative";
// import AboutDebugValue from "./AdvancedHook/AboutDebugValue";
import ContextModule from "./Pattern/ContextModule";
import CompoundPattern from "./Pattern/CompoundPattern";
import PropsGetterSetter from "./Pattern/PropsGetterSetter";
import StateReducer from "./Pattern/StateReducer";
import ControlProps from "./Pattern/ControlProps";
import SuspenseEpic from "./Suspense/SuspenseEpic";
import RenderAsYouFetch from "./Suspense/RenderAsYouFetch";
import WithCache from "./Suspense/WithCache";
import SuspenseImage from "./Suspense/SuspenseImage";
import WithSuspenseHook from "./Suspense/WithSuspenseHook";

function App() {
  return (
    <div className="App">
      {/* <FastForm /> */}
      {/* <Compound /> */}
      {/* <RenderProps /> */}
      {/* <RenderPropsAndCompound /> */}
      {/* <SuspenseTest /> */}
      {/* <VanillaTiltComponent /> */}
      {/* <Pokemon /> */}
      {/* <Counter /> */}
      {/* <ContextComponent /> */}
      {/* <Cache /> */}
      {/* <AboutLayoutEffect /> */}
      {/* <AboutImperative /> */}
      {/* <AboutDebugValue /> */}
      {/* <ContextModule /> */}
      {/* <CompoundPattern /> */}
      {/* <PropsGetterSetter /> */}
      {/* <StateReducer /> */}
      {/* <ControlProps /> */}
      {/* <SuspenseEpic /> */}
      {/* <RenderAsYouFetch /> */}
      {/* <WithCache /> */}
      {/* <SuspenseImage /> */}
      <WithSuspenseHook />
    </div>
  );
}

/* AUTH TEST */

// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { AppBar, Box, Toolbar } from "@mui/material";
// import UserProfile from "./Auth/component/UserProfile";
// import Appointments from "./Auth/pages/Appointments";
// import Auth from "./Auth/pages/Auth";
// import AuthHoc from "./Auth/component/AuthHoc";

// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <AppBar position="static">
//           <Toolbar variant="dense">
//             <Box display="flex" justifyContent="flex-end" width="100%">
//               <UserProfile />
//             </Box>
//           </Toolbar>
//         </AppBar>
//         <AuthHoc>
//           <Routes>
//             <Route path={"/"} element={<Appointments />} />
//             <Route path={"/auth"} element={<Auth />} />
//             <Route path={"/appointment/:id"} element={<Appointments />} />
//           </Routes>
//         </AuthHoc>
//       </BrowserRouter>
//     </>
//   );
// }

export default App;
