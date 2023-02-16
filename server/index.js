const products = require("./db.json");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const parseQueryString = (search) =>
  (search ?? "")
    .replace(/^\?/g, "")
    .split("&")
    .reduce((acc, query) => {
      const [key, value] = query.split("=");

      if (key) {
        acc[key] = decodeURIComponent(value);
      }

      return acc;
    }, {});

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

const port = process.env.PORT || 8081;

const API_HOST = "https://api.sixshop.com";

const USER = {
  id: "sixshop_001",
  name: "김식스",
};

app.post(`${API_HOST}/login`, (req, res, ctx) => {
  return res(
    ctx.json({
      data: {
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoic2l4c2hvcF8wMDEifX0.2Tm3R1A8dcIZdg3bfVxgHN9f36Ubolb6k1CKxAiL3QE",
        user: USER,
      },
    })
  );
});

app.get(`${API_HOST}/users/:userId`, (req, res, ctx) => {
  const { userId } = req.params;

  if (userId === USER.id) {
    return res(
      ctx.json({
        data: {
          user: USER,
        },
      })
    );
  }

  return res(
    ctx.status(404),
    ctx.json({
      error: {
        message: "User not found",
      },
    })
  );
});

app.get(`/products`, (req, res, ctx) => {
  // const { page = 1, size = 10 } = parseQueryString(req.url.search);

  // const start = (Number(page) - 1) * Number(size);
  // const end = Number(page) * Number(size);
  // const filteredProducts = products.slice(start, end);

  if (products) {
    return res(
      ctx.json({
        data: {
          products: products,
        },
      })
    );
  }

  return res(
    ctx.status(404),
    ctx.json({
      error: {
        message: "Products not found",
      },
    })
  );
});

app.get(`${API_HOST}/products/:id`, (req, res, ctx) => {
  const { id } = req.params;

  const index = Number(id) - 1;
  const product = products[index];

  if (product) {
    return res(
      ctx.json({
        data: {
          product: products[index],
        },
      })
    );
  }

  return res(
    ctx.status(404),
    ctx.json({
      error: {
        message: "Product not found",
      },
    })
  );
});

app.listen(port, () => {
  console.log(`서버가 구동되었습니다. localhost:${port}`);
});
