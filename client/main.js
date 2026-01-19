const form = document.getElementById("verify-form");
const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const result = document.getElementById("result");
const preview = document.getElementById('imagePreview');
const clipScoreDiv = document.getElementById('clip_score');
const blipTextDiv = document.getElementById('blip_text');
const imagesGallery = document.querySelector('.images-gallery');
let filename;

async function getAllimages() {
  try {
    const imagesResponse = await fetch("http://localhost:8000/data/list_images", {
      method: "GET"
    });
    const imagesData = await imagesResponse.json();
    console.log("imagesData",imagesData)
    if (imagesData.status === "ok") {
      imagesGallery.innerHTML = imagesData.images.map(img => `<img src="http://localhost:8000/images/${img.url}" alt="${img.filename}" />`).join('');
    } else {
      throw new Error(imagesData.message);
    }
  } catch (error) {
    console.log("Error fetching images:", error);
  }
}
getAllimages();
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
      }
      else {
        throw new Error(data);
      }

    } catch (error) {
      console.log("Error uploading image:", error.message);
    }
  }
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
  imageInput.addEventListener('change', function (e) {
    const input = e.target;
    const file = input?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        if (preview) {
          preview.src = ev.target?.result;
          preview.style.display = 'block';
        }
      }
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    blipTextDiv.textContent = ""
    clipScoreDiv.textContent = ""
    //await uploadImage();
    filename = "DSC_6831-258.jpg"
    const text = textInput.value;
    
    if (filename && text) {
      try {
        loading = document.createElement("div");
        loading.className = "loading";
        result.appendChild(loading);

        const clip_data = await clipVerifyScore(filename, text);
        if (clip_data.status === "ok") {
          clipScoreDiv.textContent = "Clip score: " + clip_data.analyze_score;
        }
        else {
          throw `Error getting clip score: ${clip_data.message}`;
        }

        const blip_data = await blipImgAnalyze(filename, text);

        if (blip_data.status === "ok") {
          blipTextDiv.textContent = "BLIP suggestion: " + blip_data.text_blip;
        }
        else {
          throw `Error getting BLIP analysis: ${blip_data.message}`;
        }

      } catch (error) {
        alert("somthing went wrong")
        console.log(error);
      }
      result.removeChild(loading);
    }
    else {
      alert("Please provide both an image and text.");
    }

  });
