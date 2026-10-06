const loginForm = document.querySelector("#login .form")
const inputs = loginForm.querySelectorAll(".input")
const msg = loginForm.querySelector(".msg")

loginForm.addEventListener("input", async (ev) => {
    msg.classList.remove("op-1")
})

loginForm.addEventListener("submit", async (ev) => {
    ev.preventDefault()

    const formData = {
        email: inputs[0].value,
        password: inputs[1].value,
    }

    const res = await fetch("./login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    })

    if (!res.ok) {
        msg.classList.add("op-1")
    } else {
        window.location.href = "/profile";
    }
}) 
