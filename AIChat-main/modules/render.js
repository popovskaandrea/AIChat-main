import { getRow, getRows } from "../database/database.js";

export function renderHome(req, res) {
    res.render("index", {
        username: req.session.username,
        loggedIn: req.session.loggedIn,
    });
}

export function renderLogin(req, res) {
    res.render("login", {
        loggedIn: req.session.loggedIn,
    });
}

export function renderRegister(req, res) {
    res.render("register", {
        loggedIn: req.session.loggedIn,
    });
}

export async function renderProfile(req, res, next) {
    const user = await getRow("user", "id", req.user.id)
    const chats = await getRows("chat", "user_id", req.user.id)

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.isVerified = req.user.email_is_verified;
    req.session.loggedIn = req.loggedIn;
    req.session.save();

    res.render(`profile`, {
        username: req.session.username,
        email: req.session.email,
        isVerified: req.session.isVerified,
        loggedIn: req.session.loggedIn,
        chats: chats,
    });
}
