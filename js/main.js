console.log("main.js is running");
0;

const handleForgetPassword = () => {
  console.log("Forget Password Button clicked");
  alert("🔒 Please contact Evergreen General Hospital adminstration");
};

const handleSignUp = () => {
  console.log("Sign Up Button clicked");
  alert("🔒 Please contact Evergreen General Hospital adminstration");
};

const handleSignInValidation = () => {
  const usernameValue = document.getElementById("usernameInput").value;
  const passwordValue = document.getElementById("passwordInput").value;

  console.log("Username:", usernameValue);
  console.log("Password:", passwordValue);

  if (usernameValue === "justen" || passwordValue === "password") {
    console.log("Sign in successful");
    window.location.href = "dashboard.html";
  } else {
    console.log("Sign in unsuccessful");
    alert("⛔️ Please insert valid credentials");
  }
};

// 404.html

const handleGoHome = () => {
  console.log("Take me home button clicked");
  window.location.href = "index.html";
};
