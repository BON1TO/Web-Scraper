import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Ensure you have an external CSS file

function App() {
  const [url, setUrl] = useState(""); // Stores input URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }
  
    if (loading) return;  // ⛔ Prevents multiple requests
    setLoading(true);
    setError(null);
    setData(null);
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/scrape", {
        url: url.trim(),
      });
  
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        setError("⚠️ No data found. Try again.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("❌ Failed to fetch data. Ensure the backend is running.");
    }
  
    setLoading(false);
  };
  

  return (
    <div className="container">
      <h1 className="title">🌐 Web Crawler</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
        />
        <button onClick={fetchData} className="button">
          Scrape
        </button>
      </div>

      {loading && <p className="loading">⏳ Scraping in progress...</p>}
      {error && (
        <div>
          <p className="error">{error}</p>
          <button onClick={fetchData} className="retry-button">
            🔄 Retry
          </button>
        </div>
      )}

      {data && (
        <div className="result-container">
          <h2 className="result-title">📄 Website Information</h2>
          <p><strong>📌 Title:</strong> {data.title || "N/A"}</p>
          <p><strong>📝 Meta Description:</strong> {data.meta_description || "N/A"}</p>
          <p><strong>🔤 First H1 Tag:</strong> {data.h1 || "N/A"}</p>

          <h3>🔗 Links Found (Limited):</h3>
          <ul className="link-list">
            {data.links && data.links.length > 0 ? (
              data.links.slice(0, 10).map((link, index) => (
                <li key={index} className="link-item">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="link">
                    {link}
                  </a>
                </li>
              ))
            ) : (
              <p>No links found.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
