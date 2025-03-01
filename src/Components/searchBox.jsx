import "./styles.css";
const SearchBox = ({ onSearch, query, setQuery }) => {
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch();
  };

  return (
    <div className="search-box">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a city..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBox;
