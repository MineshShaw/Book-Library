const apiKey = "AIzaSyCvvosyUuT2HfwtvDDfEuXHABYz6CBk8Ng";
const url = `https://www.googleapis.com/books/v1/volumes?q=subject:Fiction|Mystery|Fantasy|Science-Fiction|Romance&orderBy=newest&maxResults=10&key=${apiKey}`;
const newReleaseSection = document.getElementById("new-releases");

fetch(url)
.then(response => {
return response.json();
})
.then(data => {   ;
data.items.forEach(book => {
    createNewReleaseCard(book);
});
})
.catch(error => console.error("Error fetching books:", error));

function createNewReleaseCard(bookData) {
    const card = document.createElement("div");
    card.classList.add("card", "new-releases-card");
    if (bookData.volumeInfo.authors.join(', ').length > 50) {
        bookData.volumeInfo.authors = bookData.volumeInfo.authors.join(', ').slice(0, 50) + "...";
    }
    let imageUrl;
    const img = new Image();
    img.url = bookData.volumeInfo.imageLinks.thumbnail;
    img.onload = () => {imageUrl = `${img.url}`;}
    img.onerror = () => {imageUrl = "./src/assets/noThumbnailAvailable.jpg";}
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${bookData.volumeInfo.title}</h5>
            <p class="card-text">${bookData.volumeInfo.authors}</p>
            <p class="card-text">${bookData.volumeInfo.publishedDate}</p>
            <img src="${imageUrl}" alt="${bookData.volumeInfo.title}">
            <button class="btn btn-primary">Add to My Books</button>
        </div>
    `;
    newReleaseSection.appendChild(card);
}
