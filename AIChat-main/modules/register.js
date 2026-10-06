import bcrypt from "bcrypt"
import { insertRow } from "../database/database.js";

export async function register(req, res) {
    const formData = req.body;

    try {
        if (formData.password === formData.confirmPassword) {
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            const [insertUser] = await insertRow(
                "user", [
                    formData.username,
                    formData.email,
                    hashedPassword,
                    false,
                ]
            );

            res.status(200).json("'ok'");
        } else {
            res.status(400).json("'Passwords dont match'");
        }
    } catch (err) {
        res.status(409).json(err.message);
    }
}
