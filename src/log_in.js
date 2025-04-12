"use strict";
const url_login = "http://localhost:3000/login";
const username_input = document.getElementById("username");
const password_input = document.getElementById("password");
const button_login = document.getElementById("submit_button");
class Login {
    init(data) {
        const { username, password } = data;
        if (login.checkUsername(username) != 1)
            return;
        if (login.checkPassword(password) != 1)
            return;
        login.log_in(data);
    }
    checkUsername(username) {
        const username_regex = /^[a-zA-Z0-9]{3,}$/;
        if (username_regex.test(username)) {
            return 1;
        }
        else {
            login.showPopover("username_error", "Invalid username");
            return 0;
        }
    }
    checkPassword(password) {
        const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (password_regex.test(password)) {
            return 1;
        }
        else {
            login.showPopover("password_error", "Invalid password");
            return 0;
        }
    }
    async log_in(data) {
        try {
            const { username, password } = data;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });
            console.log(await response.json());
            if (response.status === 200) {
                const responseData = await response.json();
                window.location.href = `localhost:3000/ + ${responseData.redirect} `;
            }
            else {
                const errorMessage = await response.text();
                console.error(errorMessage);
                this.showPopover("login_error", errorMessage);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    showPopover(id, message) {
        const popover = document.getElementById(id);
        popover.innerHTML = message;
        popover.showPopover();
    }
    hidePopover(id) {
        const popover = document.getElementById(id);
        popover.innerHTML = "";
        popover.hidePopover();
    }
}
const login = new Login();
button_login.addEventListener("click", () => {
    const data = {
        username: username_input.value,
        password: password_input.value,
    };
    login.init(data);
});
