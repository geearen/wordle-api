import express, { Application, Request, Response } from "express";
import cors from "cors";
import wordleRoute from "./routes/wordle";
import path from "path";

const port = process.env.PORT || 4000;
const app: Application = express();

const viewsPath = path.join(__dirname, "../src/views");
app.set("views", viewsPath);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(require("./utils/logger"))

app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", function (req:Request, res: Response) {
  const context = {error: null};
  return res.render("home.ejs", context)
});

app.use("/api", wordleRoute);

app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;