import { useWordsStore } from "../store/useWords";
import { GAME_MODE, PUNCTUATION_MODE } from "../utils/constants";

const useGameModeOpts = () => {
  const {
    gameMode,
    setGameMode,
    punctuationMode,
    setPunctuationMode,
    timeSelected,
    setTimeSelected,
    selectedWords,
    setSelectedWords,
  } = useWordsStore();

  const handleChangeGameMode = (mode) => {
    if (mode === GAME_MODE.TIME) {
      setSelectedWords(75);
    }
    if (mode === GAME_MODE.WORDS) {
      setSelectedWords(25);
    }
    if (mode === GAME_MODE.KIDS) {
      setSelectedWords(3);  // Set to 3 since we are displaying A, B, C for now
    }
    setGameMode(mode);
  };

  const handleChangePunctuationMode = (mode) => {
    if (punctuationMode === mode) setPunctuationMode(PUNCTUATION_MODE.DISABLED);
    else setPunctuationMode(mode);
  };

  const handleTimeChange = (value) => {
    setTimeSelected(value);
  };

  const handleWordsChange = (value) => {
    setSelectedWords(value);
  };

  return {
    gameMode,
    handleChangeGameMode,
    punctuationMode,
    handleChangePunctuationMode,
    timeSelected,
    handleTimeChange,
    selectedWords,
    handleWordsChange,
  };
};

export default useGameModeOpts;
