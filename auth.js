document.addEventListener("DOMContentLoaded",()=>{

const form =
document.getElementById("loginForm");

if(!form) return;

form.addEventListener("submit",login);

});

async function login(e){

e.preventDefault();

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

const {data,error} =
await supabaseClient
.from("users")
.select("*")
.eq("username",username)
.eq("password",password)
.single();

if(error){

alert("Username atau Password salah");

return;
}

localStorage.setItem(
"user",
JSON.stringify(data)
);

window.location =
"dashboard.html";
}

function logout(){

localStorage.removeItem("user");

window.location =
"index.html";
}