const navMenu = document.getElementById("menu");
const inputForm = document.getElementById("inputForm");
const regForm = document.getElementById("regForm");
const logInOut = document.getElementById("login");
const checkBox = document.getElementById("checkBox");
const loginStatus = document.getElementById("loginStatus");
const regButtons = document.getElementById("regButtons");
const buttons = document.getElementById("buttons");

//change fetchURL to http://127.0.0.1:3000 for local
const fetchURL = "http://newslettergetter.herokuapp.com";

var formEmail;
var formPass;
var loginButton;
var logoutButton;
var regButton;
var newEmail;
var newPass;
var regBut;
var cancelBut;

if (localStorage.getItem("userId") != null) {
    showLoggedIn();
} else {
    showNotLoggedIn();
}

function showLoggedIn() {
    logoutButton = document.createElement("button");
    logoutButton.innerHTML = "Log out";
    buttons.append(logoutButton);
    logoutButton.addEventListener("click", logOut);
    newsletterButton = document.createElement("button");
    newsletterButton.addEventListener("click", subToggle);
    if (localStorage.getItem("newsletter") == "true") {
        newsletterButton.innerHTML = "Unsubscribe from our newsletter!";
    } else {
        newsletterButton.innerHTML = "Subscribe to our newsletter!";
    }
    checkBox.append(newsletterButton);
    loginStatus.innerHTML = "You are logged in with userID " + localStorage.getItem("userId") + "!";

}

function subToggle() {

    fetch(fetchURL + "/users/newstoggle", {
            method: 'POST',
            body: JSON.stringify({
                id: localStorage.getItem("userId"),
                newsletter_consent: localStorage.getItem("newsletter")
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            response.json().then((data) => {
                if (data.result == false) {
                    newsletterButton.innerHTML = "Subscribe to our newsletter!";
                    localStorage.setItem("newsletter", false);
                } else if (data.result == true) {
                    newsletterButton.innerHTML = "Unsubscribe from our newsletter!";
                    localStorage.setItem("newsletter", true);
                }

            });
        })
}

function showRegister() {
    clearLogin();
    newEmail = document.createElement("input");
    newPass = document.createElement("input");
    regBut = document.createElement("button");
    cancelBut = document.createElement("button");
    newsletterCheck = document.createElement("input");
    newsLabel = document.createElement("label");
    newEmail.placeholder = "New email";
    newPass.placeholder = "New password";
    newPass.type = "password";
    newEmail.type = "text";
    cancelBut.innerHTML = "Cancel";
    regBut.innerHTML = "Register!"
    newsletterCheck.type = "checkbox";
    newsletterCheck.id = "newsletter";
    newsletterCheck.name = "Newsletter";
    newsLabel.for = "newsletter";
    newsLabel.innerHTML = "Check to subscribe to our newsletter!";
    loginStatus.innerHTML = "Enter a new username and password!";
    regForm.append(newEmail);
    regForm.append(newPass);
    regButtons.append(regBut);
    regButtons.append(cancelBut);
    checkBox.append(newsletterCheck);
    checkBox.append(newsLabel);
    regBut.addEventListener("click", register);
    cancelBut.addEventListener("click", cancel);
}

function showNotLoggedIn() {
    formEmail = document.createElement("input");
    formEmail.placeholder = "Email";
    formEmail.type = "text";
    formEmail.autoComplete = "off";
    inputForm.append(formEmail);
    formPass = document.createElement("input");
    formPass.placeholder = "Password";
    formPass.type = "password";
    formPass.autoComplete = "off";
    inputForm.append(formPass);
    loginButton = document.createElement("button");
    loginButton.innerHTML = "Log in";
    loginButton.addEventListener("click", checkLogin);
    buttons.append(loginButton);
    regButton = document.createElement("button");
    regButton.innerHTML = "Register";
    buttons.append(regButton);
    regButton.addEventListener("click", showRegister);
    loginStatus.innerHTML = "Please log in, unknown user!";
}

function logOut() {
    clearLogout();
    showNotLoggedIn();
    loginStatus.innerHTML = "You've been logged out!";
    localStorage.removeItem("userId");
    localStorage.removeItem("newsletter");
}

function cancel() {
    newEmail.remove();
    newPass.remove();
    regBut.remove();
    newsletterCheck.remove();
    newsLabel.remove();
    cancelBut.remove();
    showNotLoggedIn();
}

function checkLogin() {
    let attemptEmail = formEmail.value;
    let attemptPass = formPass.value;

    if (attemptEmail == false || attemptPass == false) {
        loginStatus.innerHTML = "Fields cannot be empty! Enter a new username and password to register.";
    } else {

        fetch(fetchURL + "/users", {
                method: 'POST',
                body: JSON.stringify({
                    email: attemptEmail,
                    password: attemptPass
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                if (response.status == 403) {
                    response.text().then(function (text) {
                        errorOut(403, text);
                    });

                } else {
                    response.json().then((data) => {
                        localStorage.setItem('userId', data.id);
                        localStorage.setItem('newsletter', data.newsletter_consent);
                        clearLogin();
                        showLoggedIn();
                    });
                }
            })

    }
}

function register() {
    let newEmailT = newEmail.value;
    let newPassT = newPass.value;
    if (newEmailT == false || newPassT == false) {
        loginStatus.innerHTML = "Fields cannot be empty! Enter a new username and password to register.";
    } else {
        fetch(fetchURL + "/users/reg", {
                method: 'POST',
                body: JSON.stringify({
                    id: 1,
                    email: newEmailT,
                    password: newPassT,
                    newsletter_consent: newsletterCheck.checked
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                if (response.status == 409) {
                    response.text().then(function (text) {
                        errorOut(409, text);
                    });
                } else {
                    cancel();
                    response.text().then(function (text) {
                        loginStatus.innerHTML = text;
                    });
                }
            })
    }
}

function clearLogin() {
    formEmail.remove();
    formPass.remove();
    loginButton.remove();
    regButton.remove();
}

function clearLogout() {
    newsletterButton.remove();
    logoutButton.remove();
}

function errorOut(code, message) {
    loginStatus.innerHTML = message + " Error code: " + code;
}