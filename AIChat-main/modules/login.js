import 'dotenv/config'
import local from "passport-local"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { getRow } from '../database/database.js'

export function initialize(passport,) {
    const authenticateUser = async (email, password, done) => {
        const user = await getRow("user", "email", email) 
        if (user == null) {
            return done(null, false, { message: "No user with that email" })
        }
        try {
            if (await bcrypt.compare(password, user.password) || password === user.password) {
                return done(null, user) 
            } else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (e) {
            return done(e)
        }
    } 
    passport.use(new local.Strategy({ usernameField: "email", passwordField: "password" }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await getRow("user", "id", id);

			if (!user) {
				return done(null, false); 
			}

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	});
}

export function logout(req, res) {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
    });
    res.redirect(`${req.locale}/login`);
}
