const form = document.getElementById("verify-form");
const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const result = document.getElementById("result");
const preview = document.getElementById('imagePreview');

let filename;
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

  if (!imageInput.files || imageInput.files.length === 0) return;

  // const formData = new FormData();
  // formData.append("image", imageInput.files[0]);
  // formData.append("text", textInput.value);

  try{
      const dataResponse= await fetch("http://localhost:8000/data/upload_img", {
      method: "POST",
      body: {image: imageInput.files[0]},
    });
      const data=await dataResponse.json();
      if(data.status==="ok"){
        filename=data.filename;
      }
      else{
          throw new Error(data.message);
      }

  }catch (error){
    console.log("Error uploading image:", error);
  }

  if (filename) {
    try {
      const clipScoreResponse = await fetch("http://localhost:8000/clip/clip_score", {
        method: "POST",
        body: {image: filename, text: textInput.value},
      });
      const data = await clipScoreResponse.json();
      if(data.status==="ok"){
          result.textContent = JSON.stringify(data, null, 2);
      }
      else{
          throw new Error(data.message);
      }
    }catch (error){
        console.log("Error getting clip score:", error);
    }
  }

});
