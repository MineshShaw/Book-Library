# Personal Library Web App

A web application for organizing and tracking books, managing reading progress, and getting personalized book recommendations.

https://book-library-one-pied.vercel.app

## Features

- Book Categorization: Store books under 'Read', 'Want to Read', and 'Currently Reading'.

- Favorites Filtering: Mark and filter favorite books for easy access.

- Reading Streak Tracking: Tracks the number of consecutive days the user has read.

- Reading Goals: Set daily, weekly, or monthly reading targets based on page count.

- Book Recommendations: Suggests books based on the user's favorite list.

- Progress Tracking: Displays a progress bar for each book to visualize pages read.

- Last Read Feature: Saves the last book and page read to allow users to continue where they left off.

## Technologies Used

- Google Books API: Fetch book data.

- LocalStorage API: Store user data persistently in the browser.

- Bootstrap: For responsive design and styling.

- HTML, CSS, JavaScript: Frontend development.

## Setup Instructions

1. Clone the repository:
    ``` bash
    git clone https://github.com/MineshShaw/Book-Library
    ```

2. Navigate to the project directory:
    ``` bash
    cd Book-Library
    ```

3. Open ```index.html``` in a browser to start using the app.

## Future Improvements

- Implement cloud storage for cross-device sync.

- Add user authentication for a personalized experience.

- Add dark mode for better UI accessibility.

## File Structure
    ```bash
        .
        ├─ src
        │   ├─ assets
        │   │   └─ thumbnailPlaceholder.jpg
        │   ├─ css
        │   │   ├─ home.css
        │   │   └─ myBooks.css
        │   └─ js
        │       ├─ home.js
        │       └─ myBooks.js
        │
        ├─ index.html
        ├─ myBooks.html
        └─ README.md
        
    ```