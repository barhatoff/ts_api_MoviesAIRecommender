import express from "express";
import bodyParser from "body-parser";
import { authRouter, errorHandlerRouter, mainRouter } from "./routes";

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/main", mainRouter);
app.use(/(.*)/, errorHandlerRouter._notFoundHandler);
app.use(errorHandlerRouter._handleErrors);

app.listen(3000, () => {
  console.log(`listen 3000`);
});
