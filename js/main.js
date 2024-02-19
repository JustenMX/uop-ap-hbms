/**
 * ==============================================
 * * JUST FOR FUN 😀
 * ==============================================
 */

console.log(
  "     ██╗██╗   ██╗███████╗████████╗███████╗███╗   ██╗███╗   ███╗██╗  ██╗"
);
console.log(
  "     ██║██║   ██║██╔════╝╚══██╔══╝██╔════╝████╗  ██║████╗ ████║╚██╗██╔╝"
);
console.log(
  "     ██║██║   ██║███████╗   ██║   █████╗  ██╔██╗ ██║██╔████╔██║ ╚███╔╝ "
);
console.log(
  "██   ██║██║   ██║╚════██║   ██║   ██╔══╝  ██║╚██╗██║██║╚██╔╝██║ ██╔██╗ "
);
console.log(
  "╚█████╔╝╚██████╔╝███████║   ██║   ███████╗██║ ╚████║██║ ╚═╝ ██║██╔╝ ██╗"
);
console.log(
  " ╚════╝  ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝"
);

console.log("Page loaded. Initiating system checks...");
console.log("Watchtower activated. Monitoring all page elements...");
console.log("Network secured. Proceed with caution.");
console.log("main.js is running");

/**
 * ==============================================
 * * HANDLE FORGOT PASSWORD (ONCLICK())
 * ==============================================
 * Function: handleForgetPassword()
 * ==============================================
 */

const handleForgetPassword = () => {
  console.log("Forget Password Button clicked");
  alert("🔒 Please contact Lilly Hope Hospital adminstration");
};

/**
 * ==============================================
 * * HANDLE SIGNUP (ONCLICK())
 * ==============================================
 * Function: handleSignUp()
 * ==============================================
 */

const handleSignUp = () => {
  console.log("Sign Up Button clicked");
  alert("🔒 Please contact Lilly Hope Hospital adminstration");
};

/**
 * ==============================================
 * * HANDLE SIGN IN VALIDATION (ONCLICK())
 * ==============================================
 * Function: handleSignInValidation()
 * ==============================================
 * Description: Simple Login validation with hardcoded Username & Password
 * username: justen
 * password: password
 * ==============================================
 */

const handleSignInValidation = () => {
  const usernameValue = document.getElementById("usernameInput").value;
  const passwordValue = document.getElementById("passwordInput").value;

  console.log("Username:", usernameValue);
  console.log("Password:", passwordValue);

  if (usernameValue === "justen" && passwordValue === "password") {
    console.log("Sign in successful");
    window.location.href = "dashboard.html";
  } else {
    console.log("Sign in unsuccessful");
    alert("⛔️ Please insert valid credentials");
  }
};

/**
 * ==============================================
 * * HANDLE LOG OFF (ONCLICK())
 * ==============================================
 * Function: handleLogOff()
 * ==============================================
 * Description: Simple log off that will bring the user to index.html
 * Log off button can be found in sidebar menu
 * ==============================================
 */

const handleLogOff = () => {
  const logOffConfirmation = window.confirm(
    "Are you sure you want to log off?"
  );
  if (logOffConfirmation) {
    window.location.href = "index.html";
  } else {
    alert("Log Off Cancelled");
  }
};

/**
 * ==============================================
 * * HANDLE BACK HOME (ONCLICK())
 * ==============================================
 * Function: handleGoHome()
 * ==============================================
 * Description: 404 ERROR which is handled by a html, but I did not cater this logic in my project. There a page, and if you navigate to 404.html, it works, but I have not handled the capture of error and navigate to 404.html
 * ==============================================
 */

const handleGoHome = () => {
  console.log("Take me home button clicked");
  window.location.href = "index.html";
};
