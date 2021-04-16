const navMenu = document.getElementById("menu");
const inputForm = document.getElementById("inputForm");
const regForm = document.getElementById("regForm");
const logInOut = document.getElementById("login");
const checkbox = document.getElementById("checkbox");

var loginStatus = document.getElementById("loginStatus");
var secretContent = document.getElementById("secretContent");

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
    inputForm.append(logoutButton);
    logoutButton.addEventListener("click", logOut);
    loginStatus.innerHTML = "You are logged in, " + localStorage.getItem("userId") + "!";
}

function showRegister() {
    clearLogin();
    secretContent.innerHTML = "";
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
    newsletterCheck.type =  "checkbox";
    newsletterCheck.id = "newsletter";
    newsletterCheck.name = "Newsletter";
    newsLabel.for = "newsletter";
    newsLabel.innerHTML = "Check to subscribe to our newsletter!";
    loginStatus.innerHTML = "Enter a new username and password!";
    regForm.append(newEmail);
    regForm.append(newPass);
    regForm.append(regBut);
    regForm.append(cancelBut);
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
    inputForm.append(loginButton);
    loginButton.addEventListener("click", checkLogin);

    regButton = document.createElement("button");
    regButton.innerHTML = "Register";
    inputForm.append(regButton);
    regButton.addEventListener("click", showRegister);

    loginStatus.innerHTML = "Please log in, unknown user!";
    secretContent.innerHTML = "";

}

function logOut() {
    clearLogout();
    showNotLoggedIn();
    loginStatus.innerHTML = "You've been logged out!";
    localStorage.removeItem("userId");
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

    fetch("http://localhost:3000/users",{
        method:'POST',
        body: JSON.stringify({
            email: attemptEmail,
            password: attemptPass
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        if (response.status == 403) {
            errorOut(403);
        }
        else{ response.json().then((data) => {
            localStorage.setItem('userId', data);
            clearLogin();
            showLoggedIn();
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
    logoutButton.remove();
}

function register() {
    let newEmailT = newEmail.value;
    let newPassT = newPass.value;
    if (newEmailT == false || newPassT == false) {
        loginStatus.innerHTML = "Fields cannot be empty! Enter a new username and password to register.";
    } else {
        fetch("http://localhost:3000/users/reg",{
            method:'POST',
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
        .then(function(response) {
            if (response.status == 409) {
                errorOut(409);
            }
            else{
                cancel();
                loginStatus.innerHTML = "You have registered. Please log in with your new username and password.";
            }
        })
    }
}

function errorOut(code){
    if(code==409){
        loginStatus.innerHTML = "Registration failed!";
    }
    else if(code==403){
        loginStatus.innerHTML = "Invalid username or password";
    }

}