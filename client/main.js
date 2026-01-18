const form = document.getElementById("verify-form");
const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
//const result = document.getElementById("result");
const preview = document.getElementById('imagePreview');
const clipScoreDiv = document.getElementById('clip_score');
const blipTextDiv = document.getElementById('blip_text');
let filename;
async function uploadImage() {
  if (!imageInput.files || imageInput.files.length === 0) return;

  try{
      const uploadForm = new FormData();
      uploadForm.append('image', imageInput.files[0]);

      const dataResponse= await fetch("http://localhost:8000/data/upload_img", {
      method: "POST",
      body: uploadForm,
    });
      const data=await dataResponse.json();
      if(data.status==="ok"){
        filename=data.filename;
      }
      else{
          throw new Error(data);
      }

  }catch (error){
    console.log("Error uploading image:", error.message);
  }
}
async function clipVerifyScore(filename, text) {
      try {
      const clipScoreResponse = await fetch("http://localhost:8000/clip/clip_score", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({image_name: filename, text: text}),
      });
      const data = await clipScoreResponse.json();

      console.log("Received data:", data);
      return data;
    }catch (error){
        console.log("Error getting clip score:", error.message);
    }
}
async function blipImgAnalyze(filename){
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
    console.log("Error getting BLIP analysis:", error.message);
  }
}
imageInput.addEventListener('change', function(e) {
      const input = e.target;
      const file = input?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
         
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
  blipTextDiv.textContent=""
  clipScoreDiv.textContent=""
  //await uploadImage();
  filename="DSC_6831-258.jpg"
  const text = textInput.value;

  if (filename && text) {
    clipScoreDiv.textContent="Loading..."

    const clip_data = await clipVerifyScore(filename, text);
    if (clip_data.status==="ok"){ 
      clipScoreDiv.textContent = clip_data.analyze_score;
    }
    else{
      clipScoreDiv.textContent = clip_data.message;
    }
    blipTextDiv.textContent="Loading..."
    const blip_data = await blipImgAnalyze(filename, text);
    if (blip_data.status==="ok"){
      blipTextDiv.textContent = blip_data.text_blip;
    }
    else{
      blipTextDiv.textContent = blip_data.message;
    }

  }
  else{
     alert("Please provide both an image and text.");
  }

});
