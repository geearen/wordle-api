// const express = require("express");
// const cors = require("cors");
// const routes = require("./routes");

import express, { Application } from "express";
import cors from "cors";
import wordleRoute from "./routes/wordle";

const port = process.env.PORT || 4000;
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", wordleRoute);

app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;