// Variables
const newReleaseSection = document.getElementById("new-releases");
const reccommendedSection = document.getElementById("recommendations");
let myBooks = localStorage.getItem("myBooks")
  ? JSON.parse(localStorage.getItem("myBooks"))
  : [];
let userData = localStorage.getItem("bookListUserData") ? JSON.parse(localStorage.getItem("bookListUserData")) : [];
if (userData.challenges === undefined) {
    userData = {"challenges": {"progress": 0, "challenge": 0, "timePeriod": "none", "lastReadDate": "none", "readingStreak": 0}, "lastRead": "none"};
    localStorage.setItem("bookListUserData", JSON.stringify(userData));
}
const addBookBtn = document.getElementById("add-to-my-books");
const searchBox = document.getElementById("search-box");
const suggestionBox = document.getElementById("suggestion-box");
const addBookModal = document.getElementById("add-book-modal");
const pushBookBtn = document.querySelectorAll(".push-book");
let bookDataHolder = {};
const dropDownButton = document.querySelector(".drop-down-button");
const dropDown = document.querySelector(".drop-down");
const challengesDiv = document.getElementById('challenges');
const readingStreak = document.getElementById('reading-streak');
// Functions

// New Release Section

/**
 * Updates the #challenges div with the current progress of the user's
 * reading challenge. If the user has no challenge set, the div is left
 * blank.
 * @returns {undefined}
 */
function updateChallengesDiv() {
  if (userData.challenges.timePeriod == "none" || userData.challenges.challenge == 0) return;
  const timePeriod = userData.challenges.timePeriod;
  let divContent = '';
  if (userData.challenges.progress >= userData.challenges.challenge) {
      divContent = `You have completed your reading challenge! Pages read: ${userData.challenges.progress}`;
  }else if (timePeriod == "daily") {
      divContent = `You have read ${userData.challenges.progress} out of ${userData.challenges.challenge} pages today!`;
  } else if (timePeriod == "weekly") {
      divContent = `You have read ${userData.challenges.progress} out of ${userData.challenges.challenge} pages this week!`;
  } else {
      divContent = `You have read ${userData.challenges.progress} out of ${userData.challenges.challenge} pages  this month!`;
  }
  challengesDiv.innerHTML = divContent;
}

/**
 * Updates the #reading-streak div with the current reading streak of the user.
 * If the user has no reading streak, the div is left blank.
 * @returns {undefined}
 */
function updateReadingStreak() {
  const streak = userData.challenges.readingStreak;
  if (streak == 0) {
    readingStreak.querySelector('.streak-text').textContent = '';
    readingStreak.querySelector('.streak-icon').style.color = 'grey';
    return;
  };
  readingStreak.querySelector('.streak-text').textContent = `You are on a ${streak} day reading streak!`;
  readingStreak.querySelector('.streak-icon').style.color = 'green';
}

/**
 * Fetches 40 new releases from Google Books API and displays them in the
 * #new-releases section. The books are sorted by newest and are from the
 * Fiction, Mystery, Fantasy, Science-Fiction, and Romance genres.
 */
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

/**
 * Creates a new release card element for a book and appends it to the
 * #new-releases section. The card includes the book's thumbnail image,
 * title, authors, and published date. If the authors' string exceeds
 * 50 characters, it is truncated with an ellipsis. A button is included
 * to add the book to the user's collection.
 *
 * @param {Object} bookData - The data object containing book information
 *                            as retrieved from the Google Books API.
 */
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

/**
 * Displays the add book modal with the book's information and sets up the
 * data holder for the book to be added. If the book is already in the user's
 * collection, it does nothing.
 *
 * @param {Object} bookData - The data object containing book information
 *                            as retrieved from the Google Books API.
 */
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

/**
 * Adds the current book data held in bookDataHolder to the myBooks array,
 * updates the local storage with the new myBooks array, and resets 
 * bookDataHolder. Closes the addBookModal and removes the 'show' class 
 * from the drop-down menu.
 */
function pushToMyBooks() { 
  myBooks.push(bookDataHolder);
  bookDataHolder = {};
  localStorage.setItem("myBooks", JSON.stringify(myBooks));
  addBookModal.style.display = "none";
  dropDown.classList.remove("show") ;
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

/**
 * Fetches book suggestions from Google Books API based on the provided query.
 * @param {string} query The query to search the Google Books API with.
 * @returns {Promise.<Array.<Object>>} A promise that resolves to an array of 
 *   volumeInfo objects from the Google Books API. If the fetch fails, resolves to an empty array.
 */
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

/**
 * Displays the provided suggestions in the suggestionBox.
 * @param {Array.<Object>} suggestions The array of volumeInfo objects from the Google Books API.
 * @returns {void}
 */
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
  updateChallengesDiv();
  updateReadingStreak();
  fetchNewReleases();
  reccommendationCard();
});

document
  .querySelector(".close")
  .addEventListener("click", () => {
    addBookModal.style.display = "none";
    dropDown.classList.remove("show");
  });

pushBookBtn.forEach(btn => btn.addEventListener("click", () => {
    bookDataHolder.myProgressStatus = btn.innerText;
    if (bookDataHolder.myProgressStatus === "Read") {
        bookDataHolder.progress = bookDataHolder.pages;
    }
    pushToMyBooks();
}));

dropDownButton.addEventListener("click", () => {
    dropDown.classList.toggle("show");
})