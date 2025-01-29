import { useRef, useEffect } from "react";
import { useWordsStore } from "../store/useWords";
import "./styles/TypingArea.css";
import useTyping from "../hooks/useTyping";
import BlurEffect from "./BlurEffect";
import Timer from "./Timer";
import { APP_STATE, GAME_MODE } from "../utils/constants";
import useGameModeOpts from "../hooks/useGameModeOptions";

const TypingArea = () => {
  const { words, isFocused, appState } = useWordsStore();
  const { gameMode } = useGameModeOpts(); // Get current game mode
  const inputRef = useRef(null);
  const paragraphRef = useRef(null);

  useTyping(inputRef, paragraphRef);

  // Function to play sound for the letter (Kids Mode)
  const playLetterSound = (letter) => {
    const audio = new Audio(`/src/assets/sound/${letter.toUpperCase()}.mp3`); // Ensure sounds are in public/sounds/
    audio.play();
  };

  // Handle key press event
  const handleKeyPress = (event) => {
    if (gameMode === GAME_MODE.KIDS) {
      const letter = event.key.toUpperCase();
      if (letter >= "A" && letter <= "Z") {
        playLetterSound(letter);
      }
    }
  };

  // Attach event listener for keypress
  useEffect(() => {
    if (gameMode === GAME_MODE.KIDS) {
      window.addEventListener("keypress", handleKeyPress);
    }
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [gameMode]);

  // Function to determine the class based on the letter's state
  const getLetterClass = (state) => {
    switch (state) {
      case "correct":
        return "letter correct";
      case "incorrect":
        return "letter incorrect";
      case "active":
        return "letter active";
      case "correct active last":
        return "letter correct active is-last";
      case "incorrect active last":
        return "letter incorrect active is-last";
      default:
        return "letter";
    }
  };

  // Function to handle paragraph click and focus the input on mobile
  const handleParagraphClick = () => {
    inputRef.current && inputRef.current.focus();
  };

  return (
    <div
      className={`typing-area ${appState === APP_STATE.FINISHED && "hidden"}`}
    >
      <time className="timer">
        <Timer />
      </time>
      <div className="blur-wrapper">
        <div className="words-wrapper">
          <div
            id="paragraph"
            className={`words-container ${!isFocused && "blurred"}`}
            ref={paragraphRef}
            onClick={handleParagraphClick}
          >
            {words.map((wordObject, wordIndex) => (
              <span
                id={`word-${wordIndex}`}
                key={`word-${wordIndex}`}
                className="word"
              >
                {wordObject.map(({ letter, index, state }) => (
                  <span
                    key={`${wordIndex}-${index}`}
                    className={getLetterClass(state)}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </div>
          <BlurEffect />
        </div>
      </div>

      <input className="typing-area-input" autoFocus ref={inputRef}></input>
    </div>
  );
};

export default TypingArea;
