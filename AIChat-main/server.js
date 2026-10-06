import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "dotenv/config";
import express from "express";
import passport from "passport";
import cors from "cors"
import session from "express-session";
import methodOverride from "method-override";
import { initialize } from "./modules/login.js";
initialize(passport);

import { router as indexRouter } from "./routes/index.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProd = process.env.NODE_ENV === "production";

app.use(cors())
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
	cookie: {
		secure: isProd,
		sameSite: "lax"
		}
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use("/", indexRouter);

app.listen(3000, () => {
	console.log("Server is up!");
});
