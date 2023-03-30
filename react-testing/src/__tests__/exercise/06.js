// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import Location from "../../examples/location";
import { useCurrentPosition } from "react-use-geolocation";

jest.mock("react-use-geolocation");

test("유저의 현재 location이 나와야 함", async () => {
  const testPosition = {
    coords: {
      latitude: 35,
      longitude: 139,
    },
  };

  let setReturnValue;
  function useMockCurrentPostion() {
    const state = React.useState([]);
    setReturnValue = state[1];
    return state[0];
  }

  useCurrentPosition.mockImplementation(useMockCurrentPostion);

  render(<Location />);
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

  act(() => {
    // 리렌더링 발생
    setReturnValue([testPosition]);
  });

  screen.debug();
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument();

  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${testPosition.coords.latitude}`
  );
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${testPosition.coords.longitude}`
  );
});

/*
eslint
  no-unused-vars: "off",
*/
