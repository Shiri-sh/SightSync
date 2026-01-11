const form = document.getElementById("verify-form") as HTMLFormElement;
const imageInput = document.getElementById("imageInput") as HTMLInputElement;
const textInput = document.getElementById("textInput") as HTMLTextAreaElement;
const result = document.getElementById("result") as HTMLElement;

imageInput.addEventListener('change', function(e) {
      const input = e.target as HTMLInputElement | null;
      const file = input?.files?.[0] as File | undefined;
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          const preview = document.getElementById('imagePreview') as HTMLImageElement;
          if (preview) {
            preview.src = ev.target?.result as string;
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
