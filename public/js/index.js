let regForm = document.querySelector(".reg-form");
let loginForm = document.querySelector(".login-form");
let regBtn = regForm.querySelector("button");
let loginBtn = loginForm.querySelector("button");

regForm.onsubmit = (e) => {
    e.preventDefault();
    
    let formData = new FormData(regForm);
    let data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    regBtn.innerText = "Processing...";

    // Call API to register the user
    fetch('http://localhost:3003/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
        regBtn.innerText = "Register";
        if (data.message === "Registration successful") {
            swal("Good Job !", "Registration Success!", "success");
        } else {
            swal("Failed !", data.message, "warning");
        }
    })
    .catch((err) => {
        regBtn.innerText = "Register";
        swal("Failed !", "Something went wrong, please try again.", "warning");
    });
};

loginForm.onsubmit = (e) => {
    e.preventDefault();
    
    let emailInput = loginForm.querySelector('input[name="email"]');
    let passwordInput = loginForm.querySelector('input[name="password"]');

    if (!emailInput || !passwordInput) {
        swal("Error", "Email or Password fields are missing.", "warning");
        return;
    }

    let loginData = {
        email: emailInput.value,
        password: passwordInput.value
    };

    loginBtn.innerText = "Please wait...";

    // Call API to login the user
    fetch('http://localhost:3003/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then((response) => response.json())
    .then((data) => {
        loginBtn.innerText = "Login";
        if (data.message === "Login successful") {
            swal("Good Job !", "Login successful", "success");
        // if (data.message === "Login successful") {
        //     window.location.href = "profile/profile.html";  // Redirect to profile page
        } else {
            swal("Warning", data.message, "warning");
        }
    })
    .catch((err) => {
        loginBtn.innerText = "Login";
        swal("Warning", "Something went wrong, please try again.", "warning");
    });
};
