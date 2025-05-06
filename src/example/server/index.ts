import express from "express";
import { getValidAccessToken } from "./src/manager.js";
import { createArtistParams } from "./src/info.js";
import request from "./src/request.js";
import * as constants from "./src/consts.js";

const app = express();
app.use(express.json());

app.get("/token", async (req, res) => {
  try {
    const token = await getValidAccessToken();
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Could not fetch access token" });
  }
});

app.get("/artist/:id", async (req, res) => {
  const id = req.params.id as string;
  const params = createArtistParams(id);
  try {
    const token = await getValidAccessToken();

    const request = await fetch(constants.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });
    const response = await request.json();
    console.log(token);
    return res.json({
      response,
    });
  } catch (error) {}
});

app.listen(3000, () => console.log("Server is running on port 3000"));
