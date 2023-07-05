import express, { Application } from "express";
import cors from "cors";
import wordleRoute from "./routes/wordle";
import path from "path";

const port = process.env.PORT || 4000;
const app: Application = express();

const viewsPath = path.join(__dirname, "./views");
app.set("views", viewsPath);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", (req, res) => {
  const context = {error: null};
  return res.render("home.ejs", context)
})
app.use("/api", wordleRoute);

app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;