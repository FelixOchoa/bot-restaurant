import wppconnect from "@wppconnect-team/wppconnect";
import express from "express";
import bodyParser from "body-parser";
import { start } from "./src/startClient.js";

const app = express();
const port = 3000;

let orders = [];

app.use(bodyParser.json());

wppconnect
  .create({
    session: "sessionName",
    headless: "new",
    catchQR: (qrCode, asciiQR) => {
      console.log(asciiQR);
    },
    logQR: false,
  })
  .then((client) => start(client, orders))
  .catch((error) => console.log(error));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get("/orders", (req, res) => {
  res.json(orders);
});
