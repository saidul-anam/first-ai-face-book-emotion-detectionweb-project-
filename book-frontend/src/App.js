import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import './book.css';
import BookDetail from './BookDetail';
import FaceEmotion from './FaceEmotion'; 

function App() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/books/')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.log('Error fetching books:', error);
      });
  }, []);

  // Function to handle when a book is clicked
  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/face-emotion">Face Emotion Recognition</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Book List</h1>
              <ul className="book-list">
                {books.map((book) => (
                  <li
                    key={book.id} // Use book.id as the key
                    className="book-item"
                    onClick={() => handleBookClick(book.id)} // Pass the actual book ID
                  >
                    <h2 className="book-title">{book.title}</h2>
                    <p className="book-author">
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p className="book-description">{book.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        <Route path="/book/:bookId" element={<BookDetail />} /> {/* Book detail page */}
        <Route path="/face-emotion" element={<FaceEmotion />} /> {/* Face emotion recognition page */}
      </Routes>
    </div>
  );
}

export default App;
