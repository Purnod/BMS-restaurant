// navigation bar 

let page_titles = {
  "login": "Abey's Kitchen | Login",
  "dashboard": "Abey's Kitchen  | Dashboard",
  "finance": "Abey's Kitchen  | Finance",
  "inventory": "Abey's Kitchen  | Inventory",
   "orders": "Abey's Kitchen  | Orders"
};

function update_title() {
  let hash = window.location.hash.substring(1);
  if (page_titles[hash]) {
    document.title = page_titles[hash];
  }
}

window.addEventListener("hashchange", () => {
  let page = location.hash.substring(1) || "login"; 
  showpage(page);      
  update_title();      
});

let initialPage = location.hash.substring(1) || "login";
showpage(initialPage);
update_title();

update_title();
// Security 
//login page 

//navigation link disable if not logged in
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isLoggedIn") === null) {
    sessionStorage.setItem("isLoggedIn", "false");
  }});


let isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
if (!isLoggedIn) {
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.style.pointerEvents = "none";
    link.style.opacity = "0.5";
  });
}

// login logic 
let users = {
    manager:{username:"manager", password:"manager123", role:"manager"},
    admin:{username:"admin", password:"admin123", role:"admin"}
};

function Login_check() {
  let entered_username = document.getElementById("username").value;
  let entered_password = document.getElementById("password").value;

  let found_user = Object.values(users).find(user => 
      user.username === entered_username && user.password === entered_password
  );
  if (found_user) {
      sessionStorage.setItem("role", found_user.role);
      sessionStorage.setItem("isLoggedIn", "true");
      alert("Login successful! Welcome, " + found_user.role);
      window.location.hash = "dashboard";

      document.querySelectorAll(".nav-links a").forEach(link => {
        link.style.pointerEvents = "auto";
        link.style.opacity = "1";
      });
}
 else {
      alert("Invalid username or password. Please try again.");
  }
  entered_username.value = "";
  entered_password.value = "";
}

// navigatio block if not logged in
function showpage(pageId) {
  let isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true" && pageId !== "login") {
      window.location.hash = "login";
      return;
  }
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";
}

// role based page show

document.addEventListener("DOMContentLoaded", () => { {
    let role = sessionStorage.getItem("role");
  if (role === "admin") {
      document.querySelectorAll(".Admin-section").forEach(el => el.style.display = "block");
  } 
  else if (role === "manager") {
      document.querySelectorAll(".Manager-section").forEach(el => el.style.display = "block");
  }
}
});