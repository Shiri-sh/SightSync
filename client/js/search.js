import {searchByDescription} from "./api.js";
export async function initSearch(formElement, searchInput, resultsContainer) {
    formElement.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!searchInput.value) return;
        resultsContainer.innerHTML = '';
        try {
            const data = await searchByDescription(searchInput.value);
            console.log("Search results:", data);

            if (!data.matches || data.matches.length === 0) {
                resultsContainer.innerHTML =
                    "<p class='empty-state'>No matching images found.</p>";
                return;
            }
            resultsContainer.innerHTML = data.matches.map(item => `
            <div class="image-result-card">
                <img src="http://localhost:8000/images/${item.filename}" alt="${item.filename}" />
                <div class="image-meta"><p class="filename">${item.filename}</p></div>
            </div>
            `).join('');
        } catch (error) {
            console.log("Error searching images:", error);
        }
    });
}
// data.matches.forEach((item) => {
//   const card = document.createElement("div");
//   card.className = "image-result-card";

//   card.innerHTML = `
//     <img src="http://localhost:8000/images/${item.filename}" alt="${item.filename}" />
//     <div class="image-meta">
//       <p class="filename">${item.filename}</p>
//     </div>
//   `;

//   resultsContainer.appendChild(card);