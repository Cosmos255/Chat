"use strict";
const url_login = "http://localhost:3000/log_in";
const username_input = document.getElementById("username");
const password_input = document.getElementById("password");
const button_login = document.getElementById("submit_button");
const loginform = document.querySelector('#register-form');
loginform.addEventListener('submit', async (e) => {
    e.preventDefault(); // <- This prevents the page from reloading!
    // Your fetch login code here
});
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
            const response = await fetch(url_login, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            console.log(responseData);
            if (response.status === 200) {
                window.location.assign(responseData.redirect);
            }
            else {
                this.showPopover("login_error", responseData.message || "Login failed");
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    showPopover(id, message) {
        const popover = document.getElementById(id);
        if (popover) {
            popover.innerHTML = message;
            if ('showPopover' in popover) {
                popover.showPopover(); // If browser supports it
            }
        }
        else {
            console.warn(`Popover element #${id} not found`);
        }
    }
    hidePopover(id) {
        const popover = document.getElementById(id);
        popover.innerHTML = "";
        popover.hidePopover();
    }
}
const login = new Login();
button_login.addEventListener("click", (e) => {
    e.preventDefault();
    const data = {
        username: username_input.value,
        password: password_input.value,
    };
    login.log_in(data);
});
