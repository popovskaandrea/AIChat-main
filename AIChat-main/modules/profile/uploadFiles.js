import crypto from "crypto"
import { getRow, getRows, insertRow } from "../../database/database.js"
import { chatWithLibrarian, createLibrarianIndex } from "./ollama.js"

export async function uploadFiles(req, res, next) {
    const files = req.files
    const userId = req.user.id
    const body = req.body
    let libId
    let apiKey

    try {
        apiKey = crypto.randomBytes(32).toString("hex")
        libId = await insertRow("chat", [body.chatName, apiKey, userId])
        await createLibrarianIndex(userId, libId[0].insertId, `uploads/${req.user.username + body.chatName}`)
    } catch(error) {
        console.log(error)
    }

    try {
        for (let i = 0; i < files.length; i++) {
            await insertRow("file", [files[i].filename, files[i].size, userId, libId[0].insertId])
        }
    } catch(error) {
        console.log(error)
    }

    res.json({ status: "ok", apiKey: apiKey })
}

export async function getFiles(req, res, next) {
    const name = req.params.name

    const chat = await getRow("chat", "name", name)
    const files = await getRows("file", "chat_id", chat.id)
    console.log(files)

    res.json(files)
}

export async function useChat(req, res, next) {
    const apiKey = req.params.apiKey
    const query = req.params.query
    const chat = await getRow("chat", "api_key", apiKey)
    
    const libRes = await chatWithLibrarian(chat.user_id, chat.id, query) 
    console.log(libRes)
    res.json(libRes)
}
