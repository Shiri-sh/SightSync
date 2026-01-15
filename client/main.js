const form = document.getElementById("verify-form");
const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const result = document.getElementById("result");
const preview = document.getElementById('imagePreview');

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

  //await uploadImage();
  filename="DSC_6831-258.jpg"
  if (filename) {
    try {
      const clipScoreResponse = await fetch("http://localhost:8000/clip/clip_score", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({image_name: filename, text: textInput.value}),
      });
      const data = await clipScoreResponse.json();

      console.log("Received data:", data);

      if(data.status==="ok"){
          result.textContent = JSON.stringify(data, null, 2);
      }
      else{
          throw new Error(data.message);
      }
    }catch (error){
        console.log("Error getting clip score:", error.message);
    }
  }

});
