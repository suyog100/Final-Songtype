import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useUIStore } from "../store/useWords"; // Import the updated store
import "./styles/AddSong.css";
import { addSongApi, searchSongsApi, getSongByIdApi } from "../Api/Api"; // Import required APIs
import { useWordsStore } from "../store/useWords"; // Import your words store
import { jwtDecode } from "jwt-decode";

const AddSong = () => {
  const {
    isPopupOpen,
    openPopup,
    closePopup,
    startSearching,
    stopSearching,
    isSearchPopupOpen,
  } = useUIStore();
  const setWordsFromLyrics = useWordsStore((state) => state.setWordsFromLyrics); // Function to set words in TypingArea
  const [songName, setSongName] = useState("");
  const [songLyrics, setSongLyrics] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addErrMessage, setAddErrMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  console.log("THE TOKEN IS ", token);

  // Function to validate JWT

  const decodedToken = token ? jwtDecode(token) : null;
  console.log("THE DECODED TOKEN IS ", decodedToken);
  const expiryTime = decodedToken ? decodedToken.exp * 1000 : 0;
  console.log("THE EXPIRY TIME IS ", expiryTime);

  const validLogin = decodedToken ? Date.now() <= expiryTime : false;
  console.log("VALID LOGIN IS ", validLogin);

  // Handle adding a new song
  const handleAddSong = () => {
    if (!songName || !songLyrics) {
      setAddErrMessage("Please enter song name and lyrics both");
      return;
    }
    const newSong = { songName, songLyrics };
    addSongApi(newSong)
      .then((response) => {
        console.log("Song added successfully:", response.data);
      })
      .catch((error) => {
        console.error(
          "Error adding song:",
          error.response?.data || error.message
        );
      });
    closePopup();
    setSongName("");
    setSongLyrics("");
  };

  // Handle search input changes
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Fetch search results
    searchSongsApi(query)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching search results:",
          error.response?.data || error.message
        );
      });
  };

  // Handle song selection from search results
  const handleSelectSong = (selectedSong) => {
    setSearchQuery(selectedSong.songName); // Set the search bar to the selected song name
    stopSearching(); // Close the search popup

    // Fetch the full song details, including lyrics
    getSongByIdApi(selectedSong._id)
      .then((response) => {
        const { songLyrics } = response.data;
        setSongLyrics(songLyrics); // Set lyrics in AddSong component
        setWordsFromLyrics(songLyrics); // Update TypingArea with lyrics
      })
      .catch((error) => {
        console.error(
          "Error fetching song by ID:",
          error.response?.data || error.message
        );
      });
  };

  return (
    <>
      {validLogin && (
        <div className="w-full max-w-4xl mx-auto flex justify-center gap-6 mb-6">
          {/* Search Songs Button */}
          <button
            onClick={startSearching}
            className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white 
          bg-transparent border border-gray-600 rounded-lg shadow-md transition-all duration-300
          hover:bg-blue-600 hover:shadow-[0px_0px_15px_#3b82f6] hover:border-blue-500"
          >
            🔍 Search Songs
          </button>

          {/* Add Song Button */}
          <button
            onClick={openPopup}
            className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white 
          bg-transparent border border-gray-600 rounded-lg shadow-md transition-all duration-300
          hover:bg-green-600 hover:shadow-[0px_0px_15px_#22c55e] hover:border-green-500"
          >
            🎵 Add Song
          </button>
        </div>
      )}
      {/* Search Popup */}
      {isSearchPopupOpen &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-gray-900 bg-opacity-90 p-8 rounded-2xl shadow-2xl w-[95%] max-w-lg">
              <h2 className="text-3xl font-bold text-white text-center">
                Search Songs
              </h2>
              <h3 className="text-base text-gray-300 text-center mt-2">
                Search for a song and test your typing speed with its lyrics
              </h3>

              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                className="mt-6 w-full p-4 text-lg rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for songs here"
              />

              <div className="mt-6 max-h-72 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((song) => (
                    <div
                      key={song._id}
                      onClick={() => handleSelectSong(song)}
                      className="p-4 text-lg rounded-md text-white hover:bg-blue-600 transition cursor-pointer"
                    >
                      {song.songName}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center mt-2">
                    No songs found
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={stopSearching}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-lg rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Add Song Popup */}
      {isPopupOpen &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            style={{
              backgroundImage: `url("https://img.freepik.com/free-vector/musical-instruments-neon-style_18591-76796.jpg?t=st=1738757066~exp=1738760666~hmac=7c4166043df8bbdd72b2f9ba2b3c50d4df17b0e75c425853d066cbd18562a769&w=1380")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-gray-900 bg-opacity-95 p-8 rounded-2xl shadow-2xl w-[95%] max-w-lg border border-blue-500">
              <h2 className="text-3xl font-bold text-white text-center neon-text">
                🎵 Add a New Song
              </h2>

              <div className="mt-4">
                <label className="text-white text-lg font-medium">
                  Song Name
                </label>
                <input
                  type="text"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  className="mt-2 w-full p-3 text-lg rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700"
                  placeholder="Enter song name"
                />
              </div>

              <div className="mt-4">
                <label className="text-white text-lg font-medium">
                  Song Lyrics
                </label>
                <textarea
                  value={songLyrics}
                  onChange={(e) => {
                    const input = e.target.value;
                    const bannedWords = ["fuck", "shit"]; // banned words here
                    const containsBannedWord = bannedWords.some((word) =>
                      input.toLowerCase().includes(word)
                    );

                    if (!containsBannedWord) {
                      setSongLyrics(input);
                    } else {
                      alert("Please avoid using inappropriate language.");
                    }
                  }}
                  className="mt-2 w-full h-40 p-3 text-lg rounded-lg bg-gray-800 text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700"
                  placeholder="Enter lyrics here..."
                />
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={closePopup}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-lg rounded-lg transition shadow-md hover:shadow-red-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const wordCount = songLyrics.trim().split(/\s+/).length;
                    if (wordCount > 50) {
                      handleAddSong();
                    } else {
                      alert("Please enter more than 50 words in the lyrics.");
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-lg transition shadow-md hover:shadow-blue-500"
                >
                  Add
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default AddSong;
