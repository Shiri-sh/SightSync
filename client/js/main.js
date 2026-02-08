import { listImages, blipImgAnalyze, uploadImageFile,clipVerifyScore} from './api.js';
import { initSearch } from './search.js';
const verifyForm = document.getElementById("verify-form");
const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const result = document.getElementById("result");
const clipScoreDiv = document.getElementById('clipScore');
const blipTextDiv = document.getElementById('blipText');
const imagesGallery = document.querySelector('.images-gallery');
const selectedImageNameSpan = document.getElementById('selectedImageName');
const selectedImageInfo = document.querySelector('.selected-image-info');
const searchInput = document.querySelector('#searchInput');
const resultsContainer = document.querySelector('#searchResults');
const blipResultDiv = document.getElementById('blipResult');
const searchForm = document.getElementById('searchForm');

let filename = null;
let selectedImageElement = null;
let tryAgainBtn = null;


async function getAllimages() {
  try {
    const imagesData = await listImages();
    if (imagesData.status === "ok") {
      imagesGallery.innerHTML = imagesData.images.map(img =>
        `<img src="http://localhost:8000/images/${img.url}" 
              alt="${img.filename}" 
              data-filename="${img.filename}"
              onclick="selectImage(this, '${img.filename}')" />`
      ).join('');
    } else {
      throw new Error(imagesData.message);
    }
  } catch (error) {
    console.log("Error fetching images:", error);
    imagesGallery.innerHTML = '<p style="color: #a0826d; text-align: center; padding: 2rem;">Error loading images</p>';
  }
}
getAllimages();


// Function to handle image selection
window.selectImage = function (imgElement, imgFilename) {
  // Remove previous selection
  if (selectedImageElement) {
    selectedImageElement.classList.remove('selected');
  }

  imgElement.classList.add('selected');
  selectedImageElement = imgElement;

  filename = imgFilename;
  isUploadedImage = false; 

  // Update selected image info
  selectedImageNameSpan.textContent = imgFilename;
  selectedImageInfo.classList.add('has-selection');

  console.log("Selected image:", filename);
}

// Function to upload new image
async function uploadImage() {
  if (!imageInput.files || imageInput.files.length === 0) return;

  try {

    const data = await uploadImageFile(imageInput.files[0]);
    if (data.status === "ok") {
      filename = data.filename;
      isUploadedImage = true;

      if (selectedImageElement) {
        selectedImageElement.classList.remove('selected');
        selectedImageElement = null;
      }

      // Update selected image info
      selectedImageNameSpan.textContent = `${imageInput.files[0].name} (uploaded)`;
      selectedImageInfo.classList.add('has-selection');

      await getAllimages();

      console.log("Uploaded image:", filename);
    } else {
      throw new Error(data.message || "Upload failed");
    }
  } catch (error) {
    console.log("Error uploading image:", error.message);
    alert("Error uploading image: " + error.message);
  }
}

// Handle file input change
imageInput.addEventListener('change', async function (e) {
  const file = e.target?.files?.[0];
  if (file) {
    await uploadImage();
  }
});

function handleBlipResult(blip_data) {
  if (blip_data.status === "ok") {
    blipTextDiv.textContent = blip_data.text_blip;
  } else {
    blipTextDiv.textContent = `Error: ${blip_data.message}`;
  }
}
function handleClipResult(clip_data) {
  if (clip_data.status === "ok") {
    clipScoreDiv.textContent = `${clip_data.analyze_score}`;
  } else {
    clipScoreDiv.textContent = `Error: ${clip_data.message}`;
  }
}

function checkValidInputs(file, text) {
  if (!file) {
    alert("Please select an image from the gallery first.");
    return false;
  }

  if (!text.trim()) {
    alert("Please provide a description.");
    return false;
  }

  return true;
}

verifyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!checkValidInputs(filename, textInput.value)) {
    return;
  }
  // Clear previous results
  clipScoreDiv.textContent = "Analyzing...";
  blipTextDiv.textContent = "Analyzing...";

  try {
    // Get CLIP score
    const clip_data = await clipVerifyScore(filename, textInput.value);
    handleClipResult(clip_data);

    // Get BLIP analysis
    const blip_data = await blipImgAnalyze(filename);
    handleBlipResult(blip_data);

    if (!tryAgainBtn) {
      tryAgainBtn = document.createElement("button");
      tryAgainBtn.type = "button";
      tryAgainBtn.textContent = "Try Again";
      tryAgainBtn.onclick = async () => {
        blipTextDiv.textContent = "Analyzing...";
        const blip_data = await blipImgAnalyze(filename);
        handleBlipResult(blip_data);
      };

      blipResultDiv.appendChild(tryAgainBtn);
    }

  } catch (error) {
    alert("Something went wrong");
    console.log(error);
    clipScoreDiv.textContent = "Error occurred during analysis";
    blipTextDiv.textContent = "Error occurred during analysis";
  }
});

initSearch(searchForm, searchInput, resultsContainer);
