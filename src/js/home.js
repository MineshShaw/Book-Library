// Variables
const newReleaseSection = document.getElementById("new-releases");
const reccommendedSection = document.getElementById("recommendations");
let myBooks = localStorage.getItem("myBooks")
  ? JSON.parse(localStorage.getItem("myBooks"))
  : [];
const addBookBtn = document.getElementById("add-to-my-books");
const searchBox = document.getElementById("search-box");
const suggestionBox = document.getElementById("suggestion-box");
const addBookModal = document.getElementById("add-book-modal");
const pushBookBtn = document.getElementById("push-book");
let bookDataHolder = {};
// Functions

// New Release Section
function fetchNewReleases() {
  const apiKey = "AIzaSyCvvosyUuT2HfwtvDDfEuXHABYz6CBk8Ng";
  const url = `https://www.googleapis.com/books/v1/volumes?q=subject:Fiction|Mystery|Fantasy|Science-Fiction|Romance&orderBy=newest&maxResults=40&key=${apiKey}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.items.forEach((book) => {
        createNewReleaseCard(book);
      });
    })
    .catch((error) => console.error("Error fetching books:", error));
}

function createNewReleaseCard(bookData) {
  const card = document.createElement("div");
  card.classList.add("new-releases-card");
  if (bookData.volumeInfo.authors.join(", ").length > 50) {
    bookData.volumeInfo.authors =
      bookData.volumeInfo.authors.join(", ").slice(0, 50) + "...";
  }
  card.innerHTML = `
        <div class="card">
            <div class="card-inner">
                <div class="card-front">
                    <img src="${
                      bookData.volumeInfo.imageLinks?.thumbnail ||
                      "src/assets/thumbnailPlaceholder.jpg"
                    }" style="width: 100%; height: 100%;" onerror="this.src='src/assets/thumbnailPlaceholder.jpg'">
                </div>
                <div class="card-back">
                    <div class="card-header">
                        <h5 class="card-title">${bookData.volumeInfo.title}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${bookData.volumeInfo.authors}</p>
                        <p class="card-text">${
                          bookData.volumeInfo.publishedDate
                        }</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary" id="add-to-my-books">Add to My Books</button>
                    </div>
                </div>
            </div>
        </div>
    `;
  card
    .querySelector("#add-to-my-books")
    .addEventListener("click", () => addToMyBooks(bookData.volumeInfo));
  newReleaseSection.appendChild(card);
}

// Add to My Books
function addToMyBooks(bookData) {
  const id = bookData.title + bookData.authors + bookData.publishedDate + bookData.publisher + bookData.categories;
  if (myBooks.some(book => book.id === id)) return;
  addBookModal.style.display = "flex";
  addBookModal.querySelector(".title").textContent = bookData.title;
  addBookModal.querySelector(".author").textContent = bookData.authors
    ? ((typeof bookData.authors === "string")? bookData.authors : bookData.authors.join(", "))
    : "Unknown Author";
  addBookModal.querySelector(".category").textContent = bookData.categories
    ? bookData.categories.join(", ")
    : "Unknown Category";
  addBookModal.querySelector(".description").textContent = bookData.description
    ? bookData.description
    : "Description not available.";
  addBookModal.querySelector(".publisher").textContent = bookData.publisher
    ? bookData.publisher
    : "Unknown Publisher";
  addBookModal.querySelector(".publishedDate").textContent =
    bookData.publishedDate ? bookData.publishedDate : "Unknown Date";
  addBookModal.querySelector(".book-image").src =
    bookData.imageLinks?.thumbnail || "src/assets/thumbnailPlaceholder.jpg";
  bookDataHolder.title = bookData.title;
  bookDataHolder.id = id;
  bookDataHolder.authors = bookData.authors;
  bookDataHolder.categories = bookData.categories;
  bookDataHolder.description = bookData.description;
  bookDataHolder.publisher = bookData.publisher;
  bookDataHolder.publishedDate = bookData.publishedDate;
  bookDataHolder.imageLinks = bookData.imageLinks;
  bookDataHolder.pages = bookData.pageCount;
  bookDataHolder.progress = 0;
}

function pushToMyBooks() { 
  myBooks.push(bookDataHolder);
  bookDataHolder = {};
  localStorage.setItem("myBooks", JSON.stringify(myBooks));
  addBookModal.style.display = "none";
}

// Browse Books
searchBox.addEventListener("input", async () => {
  let typingTimer;
  const query = searchBox.value.trim();
  if (query.length === 0) {
    suggestionBox.style.display = "none";
    return;
  }

  suggestionBox.style.display = "block";
  clearTimeout(typingTimer);
  typingTimer = setTimeout(async () => {
    const suggestions = await getSuggestions(query);
    displaySuggestions(suggestions);
  }, 500);
});

async function getSuggestions(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items ? data.items.map((item) => item.volumeInfo) : [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

function displaySuggestions(suggestions) {
  suggestionBox.innerHTML = "";
  if (suggestions.length === 0) {
    suggestionBox.innerHTML = "<p>No suggestions found</p>";
    return;
  }
  suggestions.forEach((book) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion");
    const description =
      book.description?.substring(0, 1000) + "..." ||
      "Description not available.";
    suggestionItem.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin: 10px; cursor: pointer; padding: 10px; border-radius: 8px;">
            <div style="margin: 10px">
                <img src="${
                  book.imageLinks?.thumbnail ||
                  "src/assets/thumbnailPlaceholder.jpg"
                }" onerror="this.src='src/assets/thumbnailPlaceholder.jpg'">
            </div>
            <div style="display: flex; gap: 10px; margin: 10px; cursor: pointer; padding: 10px; border-radius: 8px;">
                <div style="width: 40%">
                    <p>${
                      book.categories
                        ? book.categories.join(", ")
                        : "Unknown Category"
                    }</p>
                    <p>${book.title}</p>
                    <p>${
                      book.authors ? book.authors.join(", ") : "Unknown Author"
                    }</p>
                    <p>${book.publishedDate}</p>
                    <button class="btn btn-primary" id="add-to-my-books">Add to My Books</button>
                </div>
                <div style="width: 60%">
                    <p>${description}</p>
                </div>
            </div>
        </div>
        `;
    suggestionItem
      .querySelector("#add-to-my-books")
      .addEventListener("click", () => addToMyBooks(book));
    suggestionBox.appendChild(suggestionItem);
  });
}

// Reccommendation Section
function reccommendationCard(bookData) {
  if (myBooks.length == 0) {
    reccommendedSection.style.display = "none";
    return;
  }
}

// Events
document.addEventListener("DOMContentLoaded", () => {
  fetchNewReleases();
  reccommendationCard();
});

document
  .querySelector(".close")
  .addEventListener("click", () => (addBookModal.style.display = "none"));

pushBookBtn.addEventListener("click", pushToMyBooks);
