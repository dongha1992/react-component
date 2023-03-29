// simple test with ReactDOM
// http://localhost:3000/counter

import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import Counter from "../../components/counter";

// 각 테스트가 시작하기 전 초기화 해줘야함
beforeEach(() => {
  document.body.innerHTML = "";
});

// NOTE: this is a new requirement in React 18
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
// Luckily, it's handled for you by React Testing Library :)

global.IS_REACT_ACT_ENVIRONMENT = true;

test("counter increments and decrements when the buttons are clicked", () => {
  const div = document.createElement("div");
  document.body.append(div);

  const root = createRoot(div);
  act(() => root.render(<Counter />));

  const [decrement, increment] = div.querySelectorAll("button");
  const message = div.firstChild.querySelector("div");

  expect(message.textContent).toBe("Current count: 0");

  act(() => increment.click());
  expect(message.textContent).toBe("Current count: 1");

  act(() => decrement.click());
  expect(message.textContent).toBe("Current count: 0");
});

/* eslint no-unused-vars:0 */

test("about button dispatch event", () => {
  const div = document.createElement("div");
  document.body.append(div);

  const root = createRoot(div);
  act(() => root.render(<Counter />));

  const [decrement, increment] = div.querySelectorAll("button");
  const message = div.firstChild.querySelector("div");

  expect(message.textContent).toBe("Current count: 0");

  const incrementClickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelableL: true,
    button: 0,
  });
  act(() => increment.dispatchEvent(incrementClickEvent));
  expect(message.textContent).toBe("Current count: 1");

  const decrementClickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelableL: true,
    button: 0,
  });
  act(() => decrement.dispatchEvent(decrementClickEvent));
  expect(message.textContent).toBe("Current count: 0");
});

/* eslint no-unused-vars:0 */

test("about react testing lib", () => {
  const div = document.createElement("div");
  document.body.append(div);

  const root = createRoot(div);
  act(() => root.render(<Counter />));

  const [decrement, increment] = div.querySelectorAll("button");
  const message = div.firstChild.querySelector("div");

  expect(message.textContent).toBe("Current count: 0");

  fireEvent.click(increment);
  expect(message.textContent).toBe("Current count: 1");

  fireEvent.click(decrement);
  expect(message.textContent).toBe("Current count: 0");
});

/* eslint no-unused-vars:0 */
