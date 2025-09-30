var imgContainer = document.getElementById("imgContainer");
var button = document.getElementById("generator");

// image loading function
async function loadRandomImage() {
  try {
    const response = await fetch("https://picsum.photos/600/500");
    const imageUrl = response.url;

    // clear prev image
    imgContainer.innerHTML = "";

    const img = document.createElement("img");
    img.src = imageUrl;
    imgContainer.appendChild(img);
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

loadRandomImage();

button.addEventListener("click", loadRandomImage);