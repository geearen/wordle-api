const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", routes.wordle);

app.listen(port, () => console.log(`Server is running on port ${port}`));
