// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from "react";

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { build, fake } from "@jackfranklin/test-data-bot";
import { rest } from "msw";
import { setupServer } from "msw/node";
import Login from "../../components/login-submission";

const buildLoginForm = build({
  fields: {
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});

const server = setupServer(
  rest.post(
    "https://auth-provider.example.com/api/login",
    async (req, res, ctx) => {
      if (!req.body.password) {
        return res(
          ctx.status(400),
          ctx.json({ message: "password is strongly required" })
        );
      }
      if (!req.body.username) {
        return res(
          ctx.status(400),
          ctx.json({ message: "username required " })
        );
      }
      return res(ctx.json({ username: req.body.username }));
    }
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test(`알 수 없는 서버 에러 발생한 경우`, async () => {
  const testErrorMessage = "unknown error";
  server.use(
    rest.post(
      "https://auth-provider.example.com/api/login",
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: testErrorMessage }));
      }
    )
  );

  render(<Login />);

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  expect(screen.getByRole("alert")).toHaveTextContent(testErrorMessage);
});

test(`로그인 시 유저 이름이 화면에 나와야 함`, async () => {
  render(<Login />);
  const { username, password } = buildLoginForm();

  await userEvent.type(screen.getByLabelText(/username/i), username);
  await userEvent.type(screen.getByLabelText(/password/i), password);
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  expect(screen.getByText(username)).toBeInTheDocument();
});

test(`로그인 시 비밀번호를 입력하지 않아 에러가 발생한 경우`, async () => {
  render(<Login />);
  const { username } = buildLoginForm();

  await userEvent.type(screen.getByLabelText(/username/i), username);
  // 비밀번호 userEvent 생략
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
    `"password is strongly required"`
  );
});
