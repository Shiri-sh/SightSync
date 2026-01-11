const form = document.getElementById("verify-form");
const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const result = document.getElementById("result");
const preview = document.getElementById('imagePreview');

imageInput.addEventListener('change', function(e) {
      const input = e.target;
      const file = input?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          console.log(ev.target?.result);
          console.log(preview);
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

  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("text", textInput.value);

  const response = await fetch("http://localhost:8000/verify", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  result.textContent = JSON.stringify(data, null, 2);
});
