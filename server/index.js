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

app.listen(port, () => {
  console.log(`서버가 구동되었습니다. localhost:${port}`);
});
