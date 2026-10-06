const h2 = document.querySelector(".profile .panel .h2")
const createGrid = document.querySelector(".profile .panel .create-grid")
const aichatGrid = document.querySelector(".profile .panel .aichat-grid")
const createChat = aichatGrid.querySelector(".up .btn")
const nameInput = aichatGrid.querySelector(".up .input")
const backBtn = document.querySelector(".profile .panel .head .right .btn")
const table = createGrid.querySelector(".down .table")

function createFileRow(name, size) {
    const fileRow = document.createElement("div")
    fileRow.classList.add("row")
    fileRow.innerHTML = `
        <div class="icon">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z" clip-rule="evenodd"/>
        </svg>
        </div> 
        <div class="name">Name: ${name}</div>
        <div class="size">Size: ${size}b</div>
        `

    return fileRow
}

function createUrlRow(name, ignores) {
    const fileRow = document.createElement("div")
    fileRow.classList.add("row")
    fileRow.innerHTML = `
        <div class="url">URL</div> 
        <div class="name">${name}</div>
        <div class="ignores">Ignored: ${ignores}</div>
        `

    return fileRow
}

createChat.addEventListener("click", ev => {
    nameInput.classList.remove("d-none")
    nameInput.focus()
    createChat.classList.add("btn-ac")
})

let chatName

nameInput.addEventListener("keydown", ev => {
    if (ev.key === "Enter") {
        const value = nameInput.value
        aichatGrid.classList.add("d-none")
        createGrid.classList.remove("d-none")
        backBtn.classList.remove("d-none")
        h2.textContent = `Креирај четбот ${value}`
        chatName = value
        nameInput.value = ""
    }
})

const input = createGrid.querySelector(".left .input")
const radios = createGrid.querySelectorAll(".left .radio")
const gridInp = createGrid.querySelector(".left .grid-inp")
const inputInp = createGrid.querySelector(".left .input-inp")
const ignores = createGrid.querySelector(".left .label .ignores")
const ignore = createGrid.querySelector(".left .label .ignores .ignore")

for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", ev => {
        if (i === 0) {
            gridInp.classList.add("disabled")
            inputInp.disabled = true 
        } else {
            gridInp.classList.remove("disabled")
            inputInp.disabled = false
        }
    })
}

let num = 0
const ignoreEl = document.createElement("div")
ignoreEl.classList.add("ignore")

inputInp.addEventListener("keydown", ev => {
    if (ev.key === "Enter") {
        if (num > 0) {
            const clone = ignoreEl.cloneNode()
            clone.textContent = inputInp.value
            ignores.appendChild(clone)
            ignores.scrollLeft = ignores.scrollWidth
        } else {
            ignore.textContent = inputInp.value 
            num++
        }
        inputInp.value = ""
    }
})

ignores.addEventListener("click", ev => {
    const target = ev.target
    if (target.classList.contains("ignore")) {
        target.remove()
    }
})

const uploadFilesBtn = createGrid.querySelector(".right .upload .button")
const uploadURLs = createGrid.querySelector(".left .btn")

const chatData = new FormData()
const filesArr = []
const urls = {}

uploadFilesBtn.addEventListener("change", ev => {
    const files = ev.target.files; 

    for (let i = 0; i < files.length; i++) {
        filesArr.push(files[i]); 

        const row = createFileRow(files[i].name, files[i].size)
        table.prepend(row)
    }

    console.log(filesArr)
})

uploadURLs.addEventListener("click", ev => {
    const value = input.value
    urls[value] = []
    input.value = ""
    let string = ""

    const ignores = createGrid.querySelectorAll(".left .label .ignores .ignore")
    for (let i = 0; i < ignores.length; i++) {
        urls[value].push(ignores[i].textContent)
        string += `/${ignores[i].textContent}, `
        ignores[i].remove()
    }
    let result = string.slice(0, -2)

    const row = createUrlRow(value, result)
    table.prepend(row)
    console.log(urls)
})

const createChatBtn = createGrid.querySelector(".down .btn") 
const loading = createGrid.querySelector(".loading")
const loadingH2 = loading.querySelector(".h2")
const loadingBtn = loading.querySelector(".btn")
const loadingSpinner = loading.querySelector(".loader-spinner")
const loadingApikey = loading.querySelector(".api-key")
const loadingBot = loading.querySelector(".bot")
const keyCopy = loading.querySelector(".copy")

createChatBtn.addEventListener("click", async ev => {
    chatData.append("chatName", chatName)

    filesArr.forEach(file => {
        chatData.append("files[]", file)   
    })

    Object.entries(urls).forEach(([key, value]) => {
        chatData.append(key, value)
    })

    for (const [key, value] of chatData.entries()) {
        console.log(`${key}: `, value)
    }

    loading.classList.remove("d-none")

    const res = await fetch("./uploadFiles", {
        method: "POST",
        body: chatData
    })

    const resData = await res.json()
    console.log(resData)

    if (resData.status === "ok") {
        loadingH2.textContent = "Четот е креиран успешно!" 
        loadingBtn.textContent = "Продолжи"
        loadingBot.classList.remove("op-05")
        loadingBtn.classList.remove("disabled")
        loadingSpinner.classList.add("no-spin") 
        loadingSpinner.textContent = "✓"
        loadingApikey.textContent = resData.apiKey
    }
})

loadingBtn.addEventListener("click", ev => {
    if (!loadingBtn.classList.contains("disabled"))
        window.location.reload()
})

const chats = aichatGrid.querySelector(".chats")

if (chats) {
    chats.addEventListener("click", async ev => {
        const target = ev.target.closest(".chat")    
        const name = target ? target.querySelector(".h2").textContent : null
        if (target && target.classList.contains("chat")) {
            const res = await fetch(`./getFiles/${name}`)

            const resData = await res.json()
            console.log(resData)

            aichatGrid.classList.add("d-none")
            createGrid.classList.remove("d-none")
            backBtn.classList.remove("d-none")
            h2.textContent = `Ажурирај четбот ${name}`

            for (let i = 0; i < resData.length; i++) {
                const row = createFileRow(resData[i].name, resData[i].size)
                table.prepend(row)
            }
        }
    })
} 

backBtn.addEventListener("click", ev => {
    window.location.reload()
})

keyCopy.addEventListener("click", ev => {
    console.log(navigator.clipboard)
    navigator.clipboard.writeText("test")
})
