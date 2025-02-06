let myBooks = localStorage.getItem("myBooks") ? JSON.parse(localStorage.getItem("myBooks")) : [];
let userData = localStorage.getItem("bookListUserData") ? JSON.parse(localStorage.getItem("bookListUserData")) : [];
if (new Date().getDate() == 1) {
    userData.challenges.progress = 0;
    localStorage.setItem("bookListUserData", JSON.stringify(userData));
}
const bookModal = document.getElementById("book-modal");

function removeBookFromMyBooks(bookData) {
    myBooks = myBooks.filter(book => book.id !== bookData.id);
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
}

function renderMyBooks() {
    const myBooksList = document.querySelector(".bookshelf");
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

function displayBookData(bookData) {
    bookModal.style.display = "flex";
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
}

function removeBookFromMyBooks() {
    const id = bookModal.querySelector(".id").textContent;
    myBooks = myBooks.filter(book => book.id !== id);
    localStorage.setItem("myBooks", JSON.stringify(myBooks));
    bookModal.style.display = "none";
    renderMyBooks();
}

document.addEventListener('DOMContentLoaded', renderMyBooks);

document
  .querySelector(".close")
  .addEventListener("click", () => (bookModal.style.display = "none"));

bookModal.querySelector(".remove-book").addEventListener('click', () => {
    removeBookFromMyBooks();
    renderMyBooks();
})