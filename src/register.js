"use strict";
const usr = document.getElementById("username");
const pwd = document.getElementById("password");
const pwd2 = document.getElementById("confirm-password");
const button = document.getElementById("submit_button");
const url = "http://localhost:3000/register";
class Register {
    init() {
        usr.addEventListener("input", () => {
            if (usr.value.length > 0 && usr.value.length < 20) {
                button.disabled = true;
                usr.classList.remove("error");
                register.showNext("password");
                register.hidePopover("popover1");
            }
            else {
                usr.classList.add("error");
                button.disabled = true;
                register.hideNext("password");
                register.showPopover("popover1", "Username must be between 1 and 20 characters long");
            }
        });
        pwd.addEventListener("input", () => {
            if (pwd.value.length > 5 && pwd.value.length < 20) {
                button.disabled = true;
                pwd.classList.remove("error");
                register.showNext("confirm-password");
                register.hidePopover("popover2");
            }
            else {
                pwd.classList.add("error");
                button.disabled = true;
                register.hideNext("confirm-password");
                register.showPopover("popover2", "Password must be between 6 and 20 characters long");
            }
        });
        pwd2.addEventListener("input", () => {
            if (pwd2.value === pwd.value) {
                button.disabled = false;
                pwd2.classList.remove("error");
                register.showNext("submit_button");
                register.hidePopover("popover3");
            }
            else {
                button.disabled = true;
                pwd2.classList.add("error");
                register.hideNext("submit_button");
                register.showPopover("popover3", "Passwords do not match");
            }
        });
        button.addEventListener("click", async (event) => {
            try {
                event.preventDefault();
                const data = {
                    username: usr.value,
                    password: pwd.value,
                };
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    redirect: "follow",
                    body: JSON.stringify(data)
                });
                console.log(await response.json());
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    showNext(next) {
        const nxt = document.getElementById(next);
        if (nxt) {
            nxt.classList.remove("hidden");
        }
    }
    hideNext(next) {
        const nxt = document.getElementById(next);
        if (nxt) {
            nxt.classList.add("hidden");
        }
    }
    showPopover(target, msg) {
        const targetPopover = document.getElementById(target);
        targetPopover.innerHTML = msg;
        targetPopover.showPopover();
    }
    hidePopover(target) {
        const targetPopover = document.getElementById(target);
        targetPopover.hidePopover();
    }
}
const register = new Register();
window.addEventListener("load", () => {
    register.init();
});
