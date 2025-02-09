// Variables
let myBooks = localStorage.getItem("myBooks") ? JSON.parse(localStorage.getItem("myBooks")) : [];
let userData = localStorage.getItem("bookListUserData") ? JSON.parse(localStorage.getItem("bookListUserData")) : [];
processChallenge();
const bookModal = document.getElementById("book-modal");
const updateProgress = document.querySelector(".update-progress");
const showProgress = document.querySelector(".show-progress");
const continueReadingBtn = document.querySelector("#continue-reading");
const setGoalsBtn = document.querySelector("#set-goals");
const setReadingGoalModal = document.getElementById("set-reading-goal-modal");
const saveReadingGoalBtn = document.querySelector(".save-reading-goal");
const errorPopup = document.querySelector("#error-popup");
const progressElement = bookModal.querySelector(".progress-bar");
const filterButtons = document.querySelectorAll(".filter");
const favouritesBtn = document.querySelector(".favourites");
const toggleFavouriteBtn = document.querySelector(".toggle-favourite");
const removeReadingGoalBtn = document.querySelector(".remove-reading-goal");

if (myBooks.length == 0) {
    document.querySelector(".bookshelf").innerHTML = "<p style='color:#e3d4b9'> 📖 A journey of a thousand pages begins with a single book! Add one now and begin your reading quest.</p>";   
}
// Functions

/**
 * Resets the user's reading progress if the time period has changed.
 * Also updates the user's reading streak if the last read date is not today.
 * @returns {undefined}
 */
function processChallenge() {
    if (userData.challenges.timePeriod == "none" || userData.challenges.challenge == 0) return;
    const timePeriod = userData.challenges.timePeriod;
    const lastReadDate = new Date(userData.challenges.lastReadDate);
    const date = new Date();
    const yesterday = new Date();
    if (date.getDate() === 1) {
        if (date.getMonth() === 0) {
            yesterday.setFullYear(date.getFullYear() - 1);
            yesterday.setMonth(11);
            yesterday.setDate(31);
        } else {
            yesterday.setMonth(date.getMonth() - 1);
            yesterday.setDate(new Date(yesterday.getFullYear(), yesterday.getMonth() + 1, 0).getDate());
        }
    } else {
        yesterday.setDate(date.getDate() - 1);
    }

    const isSameAsYesterday =
    lastReadDate.getFullYear() === yesterday.getFullYear() &&
    lastReadDate.getMonth() === yesterday.getMonth() &&
    lastReadDate.getDate() === yesterday.getDate();

    if (timePeriod == "daily") {
        if (date > yesterday && isSameAsYesterday) {
            userData.challenges.progress = 0;
        }
    } else if (timePeriod == "weekly") {
        if (date.getDay() == 7 && date > yesterday && isSameAsYesterday) {
            userData.challenges.progress = 0;
        }
    } else {
        if (date.getDate() == 1 && date > yesterday && isSameAsYesterday) {
            userData.challenges.progress = 0;
        }
    }
    updateUserData();   
}

/**
 * Removes a book from the myBooks array and updates local storage.
 * 
 * @param {Object} bookData - The data object containing the book information,
 *                            which includes the book's id to be removed.
 * @returns {undefined}
 */

function removeBookFromMyBooks(bookData) {
    myBooks = myBooks.filter(book => book.id !== bookData.id);
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
}

/**
 * Updates the local storage with the user's current reading challenge
 * data in the 'bookListUserData' key.
 * @returns {undefined}
 */
function updateUserData() {
    localStorage.setItem("bookListUserData", JSON.stringify(userData));
}

/**
 * Renders the books in the myBooks array in the .bookshelf container.
 * Creates a new shelf element every 6 books and appends it to the container.
 * Each book is rendered as a card with the book's title and image and
 * is appended to the current shelf. The card is also given an event listener
 * for the click event, which calls the displayBookData function with the
 * book data as an argument.
 * @returns {undefined}
 */
function renderMyBooks(myBooks) {
    const myBooksList = document.querySelector(".bookshelf");
    myBooksList.innerHTML = "";
    if (myBooks.length == 0) return;
    let shelfID = 0;
    let index = 6;
    myBooksList.innerHTML = "";
    myBooks.forEach(book => {
        if (index%6 === 0) {
            index = 1;
            const newShelf = document.createElement("div");
            newShelf.classList.add('shelf');
            newShelf.id = ++shelfID;
            myBooksList.appendChild(newShelf);
            currentShelf = newShelf;
        }
        const card = document.createElement("div");
        card.classList.add('book');
        card.innerHTML = `
            <img src='${book.imageLinks?.thumbnail || "/src/assets/thumbnailPlaceholder.jpg"}' class="book-image" alt="">
            <div class="title">${book.title}</div>
        `;

        card.addEventListener('click', () => {
            displayBookData(book);
        });
        currentShelf.appendChild(card);
        
        index++;
    })
}

/**
 * Displays the book data modal with the book's information and updates the
 * progress bar according to the book's progress.
 *
 * @param {Object} bookData - The data object containing book information
 */
function displayBookData(bookData) {
    bookModal.style.display = "flex";
    if (bookData.favourite) toggleFavouriteBtn.classList.add('fa-solid') ;
    bookModal.querySelector(".id").textContent = bookData.id;
    bookModal.querySelector(".modal-title").textContent = bookData.title;
    bookModal.querySelector(".author").textContent = bookData.authors
        ? ((typeof bookData.authors === "string")? bookData.authors : bookData.authors.join(", "))
        : "Unknown Author";
    bookModal.querySelector(".category").textContent = bookData.categories
        ? bookData.categories.join(", ")
        : "Unknown Category";
    bookModal.querySelector(".description").textContent = bookData.description
        ? bookData.description
        : "Description not available.";
    bookModal.querySelector(".publisher").textContent = bookData.publisher
        ? bookData.publisher
        : "Unknown Publisher";
    bookModal.querySelector(".publishedDate").textContent =
        bookData.publishedDate ? bookData.publishedDate : "Unknown Date";
    bookModal.querySelector(".modal-book-image").src =
        bookData.imageLinks.thumbnail || "src/assets/thumbnailPlaceholder.jpg";
    updateProgressBar();
    toggleFavouriteBtn.addEventListener('click', () => {
        toggleFavourite();
    })
}

function toggleFavourite() {
    const id = bookModal.querySelector(".id").textContent;
    const book = myBooks.find(book => book.id === id);
    toggleFavouriteBtn.classList.toggle('fa-solid');
    if (book.favourite === undefined) book.favourite = false;
    book.favourite = !book.favourite;
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
    updateProgressBar();
}

/**
 * Updates the progress bar in the book data modal according to the book's progress.
 * @returns {void}
 */
function updateProgressBar() {
    const id = bookModal.querySelector(".id").textContent;
    const book = myBooks.find(book => book.id === id);
    const progress = (book.progress/book.pages)*100;
    progressElement.style.width = `${progress}%`;
    showProgress.textContent = `${book.progress}/${book.pages}`;
}

/**
 * Removes the currently displayed book from the user's collection, updates
 * the local storage with the new myBooks array, and updates the lastRead
 * property of the userData object. Hides the book data modal and renders
 * the updated shelves.
 *
 * @returns {void}
 */
function removeBookFromMyBooks() {
    const id = bookModal.querySelector(".id").textContent;
    myBooks = myBooks.filter(book => book.id !== id);
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
    bookModal.style.display = "none";
    userData.lastRead = (userData.lastRead == id)? "none" : userData.lastRead;
    updateUserData();
    renderMyBooks(myBooks);
}

/**
 * Displays the book data modal with the book's information that was last
 * read. If no book was last read, displays an error message. Updates the
 * user's reading streak accordingly. If the user has completed the book,
 * displays an error message.
 * @returns {void}
 */
function continueReading() {
    const id = userData.lastRead;
    console.log("id");
    if (id === 'none') {
        renderError("Book not found.")
        return;
    }
    const book = myBooks.find(book => book.id === id);
    displayBookData(book);
}

/**
 * Renders an error message in the error popup in the set reading goal modal.
 * Focuses the input field, displays the error message, and sets a timer to hide
 * the error message after 5 seconds.
 * @param {string} err - the error message
 */
function renderError(err) {
    setReadingGoalModal.querySelector("#reading-goal").focus();
    document.querySelector("#error-popup").style.right = "10px";
    document.querySelector(".error-message").textContent = err;
    document.querySelector('#error-timer').style.borderRadius = "0px";

    setTimeout(() => {
        document.querySelector("#error-popup").style.right = "-100%";
        document.querySelector('#error-timer').classList.remove('transition');
        document.querySelector("#error-timer").style.width = "100%";
    }, 5000)
    document.querySelector("#error-timer").classList.add('transition');
    document.querySelector("#error-timer").style.width = "0%";
    document.querySelector('#error-timer').style.borderRadius = "8px";
}

/**
 * Filters the myBooks array by the given category and renders the filtered
 * array in the bookshelf container.
 * @param {string} category - the category to filter by
 */
function filterBooks(category) {
    const filteredBooks = myBooks.filter(book => book.myProgressStatus.toLowerCase() == category);
    renderMyBooks(filteredBooks);
}

/**
 * Removes the user's current reading goal and resets the time period.
 * Updates the local storage with the new user data reflecting the removal
 * of the reading goal.
 */

function removeReadingGoal() {
    userData.challenges.challenge = 0;
    userData.challenges.timePeriod = "none";
    localStorage.setItem("bookListUserData", JSON.stringify(userData));
}


/**
 * Filters the myBooks array by only the books that have been marked as
 * favourites and renders the filtered array in the bookshelf container.
 */
function filterFavourites() {
    const filteredBooks = myBooks.filter(book => book.favourite);
    renderMyBooks(filteredBooks);
}

// Events

document.addEventListener('DOMContentLoaded', () => renderMyBooks(myBooks));

bookModal
  .querySelector(".close-book-data-modal")
  .addEventListener("click", () => {
    bookModal.style.display = "none";
    toggleFavouriteBtn.classList.remove('fa-solid');
});

bookModal.querySelector(".remove-book").addEventListener('click', () => {
    removeBookFromMyBooks();
})

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('active')) return;
        document.querySelector('.active').classList.remove('active');
        button.classList.add('active');
        const category = button.classList[2].split('-').join(' ');
        if (category === 'all') renderMyBooks(myBooks);
        else filterBooks(category);
    })
});

updateProgress.addEventListener('click', () => {
    const id = bookModal.querySelector(".id").textContent;
    const book = myBooks.find(book => book.id === id);
    if (book.progress == book.pages) renderError("You have completed the book.");
    book.progress += 1;
    userData.challenges.progress += 1;
    const date = new Date();
    if ((new Date(userData.challenges.lastReadDate) < date || new Date(userData.challenges.lastReadDate) == 'Invalid Date') && (new Date(userData.challenges.lastReadDate).getDay() != date.getDay())) {
        userData.challenges.readingStreak += 1; 
    }
    userData.challenges.lastReadDate = date;
    updateUserData();
    if (book.myProgressStatus === "Want to Read") {
        book.myProgressStatus = "Currently Reading";
    }
    if (book.progress === book.pages) {
        book.myProgressStatus = "Read";
        userData.lastRead = "none"
        updateUserData();
    } else if (book.progress > book.pages) {
        book.progress = book.pages;
    } else {
        userData.lastRead = book.id;
        updateUserData();
    }   
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
    updateProgressBar();
})

continueReadingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    continueReading();
});

setGoalsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setReadingGoalModal.style.display = "block";
});

setReadingGoalModal.querySelector(".close").addEventListener('click', () => {
    setReadingGoalModal.style.display = "none";
});

saveReadingGoalBtn.addEventListener('click', () => {
    if (!setReadingGoalModal.querySelector("#reading-goal").value){
        renderError("Please enter a reading goal.")
        return;
    }
    if (!setReadingGoalModal.querySelector('input[name="time-period"]:checked')) {
        renderError("Please select a time period.")
        return;
    }
    userData.challenges.challenge = setReadingGoalModal.querySelector("#reading-goal").value;
    userData.challenges.timePeriod = setReadingGoalModal.querySelector('input[name="time-period"]:checked').value;
    localStorage.setItem("bookListUserData", JSON.stringify(userData));
    setReadingGoalModal.style.display = "none";
})

favouritesBtn.addEventListener('click', () => {
    document.querySelector('.active').classList.remove('active');
    favouritesBtn.classList.add('active');
    filterFavourites();
})

removeReadingGoalBtn.addEventListener('click', () => {
    removeReadingGoal();
    setReadingGoalModal.style.display = "none";
});