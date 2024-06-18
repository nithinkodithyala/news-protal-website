import React, { useEffect, useState } from 'react';
// import { getNews } from './services/newsService';
import ReactPaginate from 'react-paginate';
import './App.css';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const API_KEY = '0341aff94a6641a68d0907537ceb9221'; 
      const BASE_URL = 'https://newsapi.org/v2';
      
      try {
        const response = await fetch(`${BASE_URL}/top-headlines?country=us&category=${category}&page=${page}&apiKey=${API_KEY}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setArticles(data.articles);
        setTotalPages(Math.ceil(data.totalResults / 20)); // Assuming 20 articles per page
      } catch (error) {
        console.error('Error fetching news:', error);
        // Handle error state or notify the user
      }
    };
    
    fetchNews();
  }, [category, page]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1); // Reset to page 1 on category change
  };

  const handlePageClick = (data) => {
    setPage(data.selected + 1);
  };

  const handleAddToFavorites = (article) => {
    setFavorites([...favorites, article]);
  };

  const handleRemoveFromFavorites = (article) => {
    setFavorites(favorites.filter(fav => fav.url !== article.url));
  };

  const isFavorite = (article) => {
    return favorites.some(fav => fav.url === article.url);
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <div className="App bg-gray-100 min-h-screen">
      <div className="bg-white p-5 shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold">React News Portal</h1>
        <div className="flex items-center">
          <select
            onChange={handleCategoryChange}
            value={category}
            className="border border-gray-300 rounded p-2 mr-4"
          >
            <option value="general">General</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
          <button
            onClick={toggleFavorites}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            {showFavorites ? 'Back to News' : 'View Favorites'}
          </button>
        </div>
      </div>

      {showFavorites ? (
        <div className="mt-10 p-5">
          <h2 className="text-2xl font-bold text-center mb-5">Favorites</h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favorites.map((article, index) => (
                <div key={index} className="bg-white p-5 rounded shadow-md">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-gray-700 mb-4">{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Read more
                  </a>
                  <button
                    onClick={() => handleRemoveFromFavorites(article)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove from Favorites
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700">No favorites yet.</p>
          )}
        </div>
      ) : (
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, index) => (
              article.urlToImage && (
                <div key={index} className="bg-white p-5 rounded shadow-md">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-gray-700 mb-4">{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Read more
                  </a>
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => {
                        if (isFavorite(article)) {
                          handleRemoveFromFavorites(article);
                        } else {
                          handleAddToFavorites(article);
                        }
                      }}
                      className={`${
                        isFavorite(article)
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                      } px-3 py-1 rounded`}
                    >
                      {isFavorite(article)
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'}
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination flex list-none'}
              activeClassName={'active font-bold'}
              pageClassName={'px-2 py-1 border rounded'}
              previousClassName={'px-2 py-1 border rounded mr-2'}
              nextClassName={'px-2 py-1 border rounded ml-2'}
              disabledClassName={'opacity-50 cursor-not-allowed'}
              activeLinkClassName={'bg-blue-500 text-white'}
            />
          </div>
        </div>
      )}
       <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>
          Created by Nithin Kodithyala |
          <a
            href="mailto:kodithyalanithin153@gmail.com"
            className="ml-1 underline"
          >
            kodithyalanithin153@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
