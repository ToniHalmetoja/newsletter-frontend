const navMenu = document.getElementById("menu");
const inputForm = document.getElementById("inputForm");
const regForm = document.getElementById("regForm");
const logInOut = document.getElementById("login");
const checkBox = document.getElementById("checkBox");
const loginStatus = document.getElementById("loginStatus");
const regButtons = document.getElementById("regButtons");
const buttons = document.getElementById("buttons");

//change fetchURL to http://127.0.0.1:3000 for local
const fetchURL = "https://newslettergetter.herokuapp.com";

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

/*Construction functions, to build whatever version of the website is required*/

function showLoggedIn() {
    logoutButton = document.createElement("button");
    logoutButton.innerHTML = "Log out";
    buttons.append(logoutButton);
    logoutButton.addEventListener("touchend", logOut);
    logoutButton.addEventListener("click", logOut);
    newsletterButton = document.createElement("button");
    newsletterButton.addEventListener("touchend", subToggle);
    newsletterButton.addEventListener("click", subToggle);
    if (localStorage.getItem("newsletter") == "true") {
        newsletterButton.innerHTML = "Unsubscribe from our newsletter!";
    } else {
        newsletterButton.innerHTML = "Subscribe to our newsletter!";
    }
    checkBox.append(newsletterButton);
    loginStatus.innerHTML = "You are logged in with userID " + localStorage.getItem("userId") + "!";
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
    loginButton.addEventListener("touchend", checkLogin);
    loginButton.addEventListener("click", checkLogin);
    buttons.append(loginButton);
    regButton = document.createElement("button");
    regButton.innerHTML = "Register";
    regButton.addEventListener("touchend", showRegister);
    regButton.addEventListener("click", showRegister);
    buttons.append(regButton);
    loginStatus.innerHTML = "Please log in, unknown user!";
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
    cancelBut.addEventListener("touchend", cancel);
    cancelBut.addEventListener("click", cancel);
    regBut.innerHTML = "Register!"
    regBut.addEventListener("touchend", register);
    regBut.addEventListener("click", register);
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
}

/*Fetch functions, all triggered by clicking buttons on the website*/

function subToggle(evt) {
    evt.preventDefault(); /*Handling of click/touch - best way I could find to have to respond to both touchend and 
    click without triggering twice*/
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

function logOut(evt) {
    evt.preventDefault();
    clearLogout();
    showNotLoggedIn();
    loginStatus.innerHTML = "You've been logged out!";
    localStorage.removeItem("userId");
    localStorage.removeItem("newsletter");
}

function cancel(evt) {
    evt.preventDefault();
    clearRegister();
    showNotLoggedIn();
}

function checkLogin(evt) {
    evt.preventDefault();
    let attemptEmail = formEmail.value;
    let attemptPass = formPass.value;
    if (attemptEmail == false || attemptPass == false) {
        loginStatus.innerHTML = "Fields cannot be empty! Enter a new username and password to register.";
    } else {
        loginStatus.innerHTML = "Login request received. Waking up the backend...";
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

function register(evt) {
    evt.preventDefault();
    let newEmailT = newEmail.value;
    let newPassT = newPass.value;
    if (newEmailT == false || newPassT == false) {
        loginStatus.innerHTML = "Fields cannot be empty! Enter a new username and password to register.";
    } else {
        loginStatus.innerHTML = "Registration request received. Waking up the backend...";
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
                    clearRegister();
                    showNotLoggedIn();
                    response.text().then(function (text) {
                        loginStatus.innerHTML = text;
                    });
                }
            })
    }
}

/*Maintenance functions that remove elements no longer required, as well as some basic error-handling*/

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

function clearRegister() {
    newEmail.remove();
    newPass.remove();
    regBut.remove();
    newsletterCheck.remove();
    newsLabel.remove();
    cancelBut.remove();
}

function errorOut(code, message) {
    loginStatus.innerHTML = message + " Error code: " + code;
}