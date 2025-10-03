var imgContainer = document.getElementById("imgContainer");
var newImgBtn = document.getElementById("generator");
var saveImgBtn = document.getElementById("save");
var submitBtn = document.getElementById("submit");
var inputEmail = document.getElementById("email");
var savedUsers = document.getElementById("savedUsers");

// == PRELOAD IMAGES FUNCTION == 
// this loads queue of 5 images in the background, so when user clicks new image button, next image is available instantly
const imageQueue = [];
const MAX_QUEUE = 5;

async function preloadImages(count = MAX_QUEUE) {
  for (let i = 0; i < count; i++) {
    // create new image object
    const img = new Image();
    const response = await fetch("https://picsum.photos/600/500");
    img.src = response.url;
    imageQueue.push(img);
  }
}


// == FUNCTION TO GET USER FROM LOCAL STORAGE
function getUserFromLocal() {
  return JSON.parse(localStorage.getItem("users")) || {};
}


// == IMAGE LOADING FUNCTION == 
async function loadRandomImage() {
  let img;

  if (imageQueue.length > 0) {
    img = imageQueue.shift();
  } else {
    const response = await fetch("https://picsum.photos/600/500");
    img = new Image();
    img.src = response.url;
  }

  // clear prev image and display new one
  imgContainer.innerHTML = ""; 
  imgContainer.appendChild(img);

  // preload next image in background
  preloadImages(1);
}


// == SAVE IMAGE FUNCTION == 
function saveCurrentImage() {
  const email = inputEmail.value;
  
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
  const users = getUserFromLocal();
  if (!users[email]) {
    users[email] = [];
  }

  // prevent the same image from being saved twice by user
  if (users[email].includes(currentImgUrl)) {
    return;
  }

  users[email].push(currentImgUrl);
  localStorage.setItem("users", JSON.stringify(users));
}


// == STORE DATA IN USER'S TABLE ROW FUNCTION == 
function displayUserRow(email) {
  const users = getUserFromLocal();
  const userImages = users[email] || [];

  // check if table row exists for user already, and create the row if not
  let userRow = document.querySelector(`tr[data-user="${email}"]`);
  if (!userRow) {
    userRow = document.createElement("tr");
    userRow.dataset.user = email;

    // Images cell
    const imagesTd = document.createElement("td");
    userRow.appendChild(imagesTd);

    // email cell
    const emailTd = document.createElement("td");
    emailTd.innerText = email;
    userRow.appendChild(emailTd);

    savedUsers.appendChild(userRow);
  }

  // add any images not already displayed
  const savedImages = userRow.children[0];
  const existingSrcs = new Set(
    Array.from(savedImages.querySelectorAll("img")).map(img => img.src)
  );

  userImages.forEach(url => {
    if (!existingSrcs.has(url)) {
      const thumbnail = document.createElement("img");
      thumbnail.src = url;
      thumbnail.style.width = "100px";
      thumbnail.style.margin = "2px";
      savedImages.appendChild(thumbnail);
    }
  });
}


// == SUBMIT SAVED IMAGES ==
function submitUser() {
  const email = inputEmail.value; 

  // enter valid email address if invalid
  if (!email) {
    alert("Please enter a valid email address.");
    return;
  }

  displayUserRow(email);
  inputEmail.value = "";
}


// == REBUILD TABLE ON PAGE LOAD ==
// makes sure data doesn't disappear when page refreshed, etc.
function rebuildSavedTable() {
  const users = getUserFromLocal();
  for (const email in users) {
    displayUserRow(email);
  }
}


// == EVENT LISTENERS ==
// preload images on page load
preloadImages(MAX_QUEUE);

//load random image on page load
loadRandomImage();

// load new images for each click
newImgBtn.addEventListener("click", loadRandomImage);

// save images to user's email
saveImgBtn.addEventListener("click", saveCurrentImage);

// submit saved images
submitBtn.addEventListener("click", submitUser);

// rebuild table on page load if local storage data exists
rebuildSavedTable();