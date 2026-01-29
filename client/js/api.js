export async function listImages() {
    const response = await fetch("http://localhost:8000/data/list_images");
    const data = await response.json();
    return data;
}
export async function uploadImageFile(file) {
    const uploadForm = new FormData();
    uploadForm.append('image', file);

    const dataResponse = await fetch("http://localhost:8000/data/upload_img", {
      method: "POST",
      body: uploadForm,
    });
    const data = await dataResponse.json();
    return data;
}
export async function blipImgAnalyze(filename){
    const blipResponse = await fetch("http://localhost:8000/blip/blip_img_anlz", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_name: filename }),
    });
    const data = await blipResponse.json();
    return data;
}
export async function clipVerifyScore(filename, text) {
    const clipScoreResponse = await fetch("http://localhost:8000/clip/clip_score", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_name: filename, text: text }),
    });
    const data = await clipScoreResponse.json();
    console.log("Received data:", data);
    return data;
}
export async function searchByDescription(text) {
  const res = await fetch("http://localhost:8000/clip/img_by_description", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}