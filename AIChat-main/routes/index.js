import express from "express";
import passport from "passport";
import fs from "fs"
import multer from "multer"
import { renderHome, renderLogin, renderProfile, renderRegister } from "../modules/render.js";
import { checkAuthenticated, checkNotAuthenticated } from "../modules/middlewares.js";
import { register } from "../modules/register.js";
import { logout } from "../modules/login.js";
import { getFiles, uploadFiles, useChat } from "../modules/profile/uploadFiles.js";

export const router = express.Router();

router.get("/", renderHome);
router.get("/login", checkNotAuthenticated, renderLogin);
router.get("/register", checkNotAuthenticated, renderRegister);
router.get("/profile", checkAuthenticated, renderProfile)

router.get("/getFiles/:name", checkAuthenticated, getFiles)
router.get("/useChat/:apiKey/:query", useChat)

router.post("/register", checkNotAuthenticated, register);
router.post(
	"/login",
	checkNotAuthenticated,
	passport.authenticate("local", {
		successRedirect: `profile`,
		failureRedirect: "",
	}),
);

router.delete("/logout", logout);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = `uploads/${req.session.username + req.body.chatName}`
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage })
router.post("/uploadFiles", checkAuthenticated, upload.array("files[]"), uploadFiles);
