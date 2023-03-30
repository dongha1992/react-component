// form testing
// http://localhost:3000/login

import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../components/login";
import { build, fake } from "@jackfranklin/test-data-bot";

test("submitting the form calls onSubmit with username and password", async () => {
  // onSubmit 줘야함
  let submittedData;
  const handleSubmit = (data) => (submittedData = data);

  render(<Login onSubmit={handleSubmit} />);
  const username = "chucknorris";
  const password = "i need no password";

  // screen.getByRole("textbox", { name: /username/i });
  await userEvent.type(screen.getByLabelText(/username/i), username);
  await userEvent.type(screen.getByLabelText(/password/i), password);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(submittedData).toEqual({
    username,
    password,
  });
});

/*
eslint
  no-unused-vars: "off",
*/

test("Jest mock test", async () => {
  // onSubmit 줘야함
  let submittedData;
  const handleSubmit = jest.fn();

  render(<Login onSubmit={handleSubmit} />);
  const username = "chucknorris";
  const password = "i need no password";

  // screen.getByRole("textbox", { name: /username/i });
  await userEvent.type(screen.getByLabelText(/username/i), username);
  await userEvent.type(screen.getByLabelText(/password/i), password);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  });
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

/*
eslint
  no-unused-vars: "off",
*/

test("Jest mock test", async () => {
  // onSubmit 줘야함
  let submittedData;
  const handleSubmit = jest.fn();

  render(<Login onSubmit={handleSubmit} />);
  const username = "chucknorris";
  const password = "i need no password";

  // screen.getByRole("textbox", { name: /username/i });
  await userEvent.type(screen.getByLabelText(/username/i), username);
  await userEvent.type(screen.getByLabelText(/password/i), password);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  });
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

/*
eslint
  no-unused-vars: "off",
*/

const buildLoginForm = build({
  fields: {
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});
test("abstract variabled", async () => {
  const handleSubmit = jest.fn();

  render(<Login onSubmit={handleSubmit} />);
  const { username, password } = buildLoginForm();

  // screen.getByRole("textbox", { name: /username/i });
  await userEvent.type(screen.getByLabelText(/username/i), username);
  await userEvent.type(screen.getByLabelText(/password/i), password);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  });
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

/*
eslint
  no-unused-vars: "off",
*/
