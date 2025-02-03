// Variables
const newReleaseSection = document.getElementById("new-releases");
const reccommendedSection = document.getElementById("recommendations");
let myBooks = localStorage.getItem("myBooks") ? JSON.parse(localStorage.getItem("myBooks")) : [];

// Functions

// New Release Section
function fetchNewReleases() {
    const apiKey = "AIzaSyCvvosyUuT2HfwtvDDfEuXHABYz6CBk8Ng";
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:Fiction|Mystery|Fantasy|Science-Fiction|Romance&orderBy=newest&maxResults=40&key=${apiKey}`;
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
}

function createNewReleaseCard(bookData) {
    const card = document.createElement("div");
    card.classList.add("new-releases-card");
    if (bookData.volumeInfo.authors.join(', ').length > 50) {
        bookData.volumeInfo.authors = bookData.volumeInfo.authors.join(', ').slice(0, 50) + "...";
    }
    card.innerHTML = `
        <div class="card">
            <div class="card-inner">
                <div class="card-front">
                    <img src="${bookData.volumeInfo.imageLinks.thumbnail}" style="width: 100%; height: 100%;" onerror="this.src='src/assets/thumbnailPlaceholder.jpg'">
                </div>
                <div class="card-back">
                    <div class="card-header">
                        <h5 class="card-title">${bookData.volumeInfo.title}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${bookData.volumeInfo.authors}</p>
                        <p class="card-text">${bookData.volumeInfo.publishedDate}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary" id="add-to-my-books">Add to My Books</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    newReleaseSection.appendChild(card);
}

function reccommendationCard(bookData) {
    if (myBooks.length == 0) {
        reccommendedSection.style.display = 'none'
        return;
    }
    
}

// Events
document.addEventListener("DOMContentLoaded", () => {
    fetchNewReleases();
    reccommendationCard();
});