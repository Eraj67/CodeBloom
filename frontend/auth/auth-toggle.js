const authCard = document.getElementById("auth-card"); 
const panel = document.getElementById("auth-panel"); 

const panelTitle = document.getElementById("panel-title"); 
const panelText = document.getElementById("panel-text"); 
const panelBtn = document.getElementById("panel-btn"); 

const showSignup = document.getElementById("show-signup"); 
const showLogin = document.getElementById("show-login"); 

let isLogin = true;

function openSignup() {
    isLogin = false;

    authCard.classList.add("signup-mode");
    panelTitle.textContent = "Hello, Friend!";
    panelText.textContent =
        "Create your CodeBloom account and begin your learning journey.";
    panelBtn.textContent = "Log In";
}

function openLogin() {
    isLogin = true;

    authCard.classList.remove("signup-mode");
    panelTitle.textContent = "Welcome Back!";
    panelText.textContent =
        "Log in to keep learning where you left off.";
    panelBtn.textContent = "Sign Up";
}

showSignup.addEventListener("click", function(e) {
    e.preventDefault();
    openSignup();
});

showLogin.addEventListener("click", function(e) {
    e.preventDefault();
    openLogin();
});

panelBtn.addEventListener("click", function() {
    if (isLogin) {
        openSignup();
    }
    else {
        openLogin();
    }
});