var imgContainer = document.getElementById("imgContainer");
var newImgBtn = document.getElementById("generator");
var saveImgBtn = document.getElementById("save");
var submitBtn = document.getElementById("submit");
var inputEmail = document.getElementById("email");
var savedUsers = document.getElementById("savedUsers");

// == UPDATE TABLE FUNCTION ==
// writing this first so i can call it in later functions
function updateSavedTable() {
  savedUsers.innerHTML == "";

  const users = JSON.parse(localStorage.getItem("users")) || {}; // REFACTOR!

  for (const email in users) {
    // get array of images saved to user's email
    const images = users[email];

    // create new table row
    const tr = document.createElement("tr");

    // create and add images cell
    const imagesTd = document.createElement("td");
    for (let i = 0; i < images.length; i++) {
      const thumbnail = document.createElement("img");
      thumbnail.src = images[i];
      thumbnail.style.width = "100px";
      thumbnail.style.margin = "2px";
      imagesTd.appendChild(thumbnail);
    }
    tr.appendChild(imagesTd);

    savedUsers.appendChild(tr)
  }
}

// == IMAGE LOADING FUNCTION == 
async function loadRandomImage() {
  try {
    const response = await fetch("https://picsum.photos/600/500");
    const fetchedUrl = response.url;

    // clear prev image
    imgContainer.innerHTML = "";

    // create new image
    const img = document.createElement("img");
    img.src = fetchedUrl;
    imgContainer.appendChild(img);
  
  // error message if link broken etc.
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

// == SAVE IMAGE FUNCTION == 
function saveCurrentImage() {
  const email = document.getElementById("email").value.trim();
  
  // tell user to enter an email if field empty/invalid
  if (!email) {
    alert("Please enter a valid email address.");
    return;
  }

  // check if img field is empty (e.g. due to broken link), and alert user if so
  const img = imgContainer.querySelector("img");
  if (!img) {
    alert("Error: no image loaded.");
    return;
  }

  const currentImgUrl = img.src;

  // store saved images in local storage
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[email]) {
    users[email] = [];
  }

  users[email].push(currentImgUrl);
  localStorage.setItem("users", JSON.stringify(users));

  //updateSavedTable();
}

// == SUBMIT SAVED IMAGES ==
function submitUser() {
  const email = inputEmail.value.trim(); //

  // enter valid email address if invalid
  if (!email) {
    alert("Please enter a valid email address.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {}; // surely i can refactor this to avoid repetition? 
  const userImages = users[email] || []; 

  updateSavedTable();
  inputEmail.value = "";
}

// == EVENT LISTENERS ==
//load random image on page load
loadRandomImage();

// load new images for each click
newImgBtn.addEventListener("click", loadRandomImage);

// save images to user's email
saveImgBtn.addEventListener("click", saveCurrentImage);

// submit saved images
submitBtn.addEventListener("click", submitUser);