const registerForm = document.querySelector("#register .form")
const inputs = registerForm.querySelectorAll(".input")
const required = registerForm.querySelectorAll(".required") 
const error = registerForm.querySelectorAll(".error")

const messages = ["user.username", "user.email", "Passwords dont match"]

registerForm.addEventListener("input", async (ev) => {
    for (let i = 0; i < required.length; i++) {
        required[i].classList.remove("op-1")
        setTimeout(() => {
            required[i].classList.remove("d-block")
        }, 200)
    }

    for (let i = 0; i < error.length; i++) {
        error[i].classList.remove("op-1")
        setTimeout(() => {
            error[i].classList.remove("d-block")
        }, 200)
    }
})

registerForm.addEventListener("submit", async (ev) => {
	ev.preventDefault()

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === "") {
            required[i].classList.add("d-block")
            setTimeout(() => {
                required[i].classList.add("op-1")
            }, 5)
            return
        }
    }

    const formData = {
        username: inputs[0].value,
        email: inputs[1].value,
        password: inputs[2].value,
        confirmPassword: inputs[3].value
    }

    const res = await fetch("./register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData)
	})

	const resData = await res.json()
    const matches = resData.match(/'([^']+)'/g);
    const message = matches[matches.length - 1].replace(/'/g, "");

    if (message === "ok") {
        window.location = "/login"
        return
    }
    
    for (let i = 0; i < messages.length; i++) {
        if (message === messages[i]) {
            error[i].classList.add("d-block")
            setTimeout(() => {
                error[i].classList.add("op-1")
            }, 5)
            return
        }
    }
})
