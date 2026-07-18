const usernameInputEl = document.getElementById("username");
const emailInputEl = document.getElementById("email");
const passwordInputEl = document.getElementById("password");
const confirmPasswordInputEl = document.getElementById("confirm-password");
const formEl = document.getElementById("registration-form");

formEl.addEventListener("submit", validateForm);

function validateForm(e) {
  e.preventDefault();

  const username = usernameInputEl.value.trim();
  const email = emailInputEl.value.trim();
  const password = passwordInputEl.value;
  const confirmPassword = confirmPasswordInputEl.value;

  const isUsernameValid = validateUsername(username);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = validateConfirmPassword(
    confirmPassword,
    password,
  );

  if (
    isUsernameValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid
  ) {
    alert("Registration successful!");
    formEl.reset();
    document.querySelectorAll(".form-group").forEach((group) => {
      group.className = "form-group";
    });
    // Submit the form to API
  }
}

function validateUsername(username) {
  let errorMsg = "";
  if (!username) {
    errorMsg = "Username is required";
    updateErrorScreen(usernameInputEl, errorMsg);
    return false;
  } else if (username.length < 3) {
    errorMsg = "Username must be at least 3 characters";
    updateErrorScreen(usernameInputEl, errorMsg);
    return false;
  } else {
    updateSuccessScreen(usernameInputEl);
    return true;
  }
}

function validateEmail(email) {
  let errorMsg = "";
  if (!email) {
    errorMsg = "Email is required";
    updateErrorScreen(emailInputEl, errorMsg);
    return false;
  } else if (
    !email.endsWith("@gmail.com") &&
    !email.endsWith("@hotmail.com") &&
    !email.endsWith("@outlook.com")
  ) {
    errorMsg = "Email is not valid";
    updateErrorScreen(emailInputEl, errorMsg);
    return false;
  } else {
    updateSuccessScreen(emailInputEl);
    return true;
  }
}

function validatePassword(password) {
  let errorMsg = "";
  if (!password) {
    errorMsg = "Password is required";
    updateErrorScreen(passwordInputEl, errorMsg);
    return false;
  } else if (password.length < 8) {
    errorMsg = "Password must be at least 8 characters";
    updateErrorScreen(passwordInputEl, errorMsg);
    return false;
  } else {
    updateSuccessScreen(passwordInputEl);
    return true;
  }
}

function validateConfirmPassword(confirmPassword, password) {
  let errorMsg = "";
  if (!confirmPassword) {
    errorMsg = "Password is required";
    updateErrorScreen(confirmPasswordInputEl, errorMsg);
    return false;
  } else if (confirmPassword.length < 8) {
    errorMsg = "Password must be at least 8 characters";
    updateErrorScreen(confirmPasswordInputEl, errorMsg);
    return false;
  } else if (confirmPassword !== password) {
    errorMsg = "Passwords do not match";
    updateErrorScreen(confirmPasswordInputEl, errorMsg);
    return false;
  } else {
    updateSuccessScreen(confirmPasswordInputEl);
    return true;
  }
}

function updateErrorScreen(inputElement, errorMsg) {
  inputElement.parentElement.classList.remove("success");
  inputElement.parentElement.classList.add("error");
  createErrorMsg(inputElement, errorMsg);
}

function updateSuccessScreen(inputElement) {
  inputElement.parentElement.classList.remove("error");
  inputElement.parentElement.classList.add("success");
}

function createErrorMsg(inputElement, message) {
  inputElement.nextElementSibling.textContent = message;
}
