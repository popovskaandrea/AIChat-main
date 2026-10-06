const logOutBtn = document.querySelector(".logout");

if (logOutBtn) {
    logOutBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        fetch("/logout", {
            method: "DELETE",
        }).then((res) => {
            window.location = "./login";
        });
    });
}
