const form = document.getElementById("verify-form");
const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const result = document.getElementById("result");
const clipScoreDiv = document.getElementById('clip_score');
const blipTextDiv = document.getElementById('blip_text');
const imagesGallery = document.querySelector('.images-gallery');
const selectedImageNameSpan = document.getElementById('selectedImageName');
const selectedImageInfo = document.querySelector('.selected-image-info');
const searchInput = document.querySelector('#searchInput');
const resultsContainer=document.querySelector('#searchResults');
let filename = null;
let selectedImageElement = null;
let isUploadedImage = false;

async function getAllimages() {
  try {
    const imagesResponse = await fetch("http://localhost:8000/data/list_images", {
      method: "GET"
    });
    const imagesData = await imagesResponse.json();
    console.log("imagesData", imagesData);
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
async function searchImages(e){
    e.preventDefault();
   if(!searchInput.value) return;
   resultsContainer.innerHTML = '';
   try {
     const searchResponse = await fetch("http://localhost:8000/clip/img_by_description", {
       method: "POST",
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ text: searchInput.value }),
     });
     const data = await searchResponse.json();
     console.log("Search results:", data);
     
    if (!data.matches || data.matches.length === 0) {
      resultsContainer.innerHTML =
        "<p class='empty-state'>No matching images found.</p>";
      return;
    }

    resultsContainer.innerHTML = "";

    data.matches.forEach((item) => {
      const card = document.createElement("div");
      card.className = "image-result-card";

      card.innerHTML = `
        <img src="http://localhost:8000/images/${item.filename}" alt="${item.filename}" />
        <div class="image-meta">
          <p class="filename">${item.filename}</p>
        </div>
      `;

      resultsContainer.appendChild(card);
    });
   } catch (error) {
     console.log("Error searching images:", error);
   }
}

// Function to handle image selection
window.selectImage = function(imgElement, imgFilename) {
  // Remove previous selection
  if (selectedImageElement) {
    selectedImageElement.classList.remove('selected');
  }
  
  // Add selection to clicked image
  imgElement.classList.add('selected');
  selectedImageElement = imgElement;
  
  // Update filename
  filename = imgFilename;
  isUploadedImage = false; // This is from gallery, not uploaded
  
  // Update selected image info
  selectedImageNameSpan.textContent = imgFilename;
  selectedImageInfo.classList.add('has-selection');
  
  console.log("Selected image:", filename);
}

// Function to upload new image
async function uploadImage() {
  if (!imageInput.files || imageInput.files.length === 0) return;

  try {
    const uploadForm = new FormData();
    uploadForm.append('image', imageInput.files[0]);

    const dataResponse = await fetch("http://localhost:8000/data/upload_img", {
      method: "POST",
      body: uploadForm,
    });
    const data = await dataResponse.json();
    if (data.status === "ok") {
      filename = data.filename;
      isUploadedImage = true;
      
      // Clear gallery selection
      if (selectedImageElement) {
        selectedImageElement.classList.remove('selected');
        selectedImageElement = null;
      }
      
      // Update selected image info
      selectedImageNameSpan.textContent = `${imageInput.files[0].name} (uploaded)`;
      selectedImageInfo.classList.add('has-selection');
      
      // Refresh gallery to show new image
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

// setInterval(getAllimages, 5000); 

async function clipVerifyScore(filename, text) {
  try {
    const clipScoreResponse = await fetch("http://localhost:8000/clip/clip_score", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_name: filename, text: text }),
    });
    const data = await clipScoreResponse.json();
    console.log("Received data:", data);
    return data;
  } catch (error) {
    throw `Error getting clip score: ${error.message}`;
  }
}

async function blipImgAnalyze(filename) {
  try {
    const blipResponse = await fetch("http://localhost:8000/blip/blip_img_anlz", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_name: filename }),
    });
    const data = await blipResponse.json();
    console.log("Received data:", data);
    return data;
  } catch (error) {
    throw `Error getting BLIP analysis: ${error.message}`;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Check if an image is selected
  if (!filename) {
    alert("Please select an image from the gallery first.");
    return;
  }
  
  // Clear previous results
  clipScoreDiv.textContent = "Analyzing...";
  blipTextDiv.textContent = "Analyzing...";
  
  const text = textInput.value;
  
  if (!text.trim()) {
    alert("Please provide a description.");
    return;
  }
  
  try {
    let loading = document.createElement("div");
    loading.className = "loading";
    result.appendChild(loading);

    // Get CLIP score
    const clip_data = await clipVerifyScore(filename, text);
    if (clip_data.status === "ok") {
      clipScoreDiv.textContent = `${clip_data.analyze_score}`;
    } else {
      clipScoreDiv.textContent = `Error: ${clip_data.message}`;
    }

    // Get BLIP analysis
    const blip_data = await blipImgAnalyze(filename, text);
    if (blip_data.status === "ok") {
      blipTextDiv.textContent = blip_data.text_blip;
    } else {
      blipTextDiv.textContent = `Error: ${blip_data.message}`;
    }

    result.removeChild(loading);
  } catch (error) {
    alert("Something went wrong");
    console.log(error);
    clipScoreDiv.textContent = "Error occurred during analysis";
    blipTextDiv.textContent = "Error occurred during analysis";
    
    const loading = result.querySelector('.loading');
    if (loading) {
      result.removeChild(loading);
    }
  }
});