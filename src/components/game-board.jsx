import {
  RotateCcw,
  Trophy,
  MoveRight,
  Gauge,
  Settings,
  Award,
  Clock,
  Medal,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

import ASNL from "../assets/logos/ASNL.png";
import CHSE from "../assets/logos/CHSE.png";
import CSK from "../assets/logos/CSK.png";
import DC from "../assets/logos/DC.png";
import DCH from "../assets/logos/DCH.png";
import FCB from "../assets/logos/FCB.png";
import GT from "../assets/logos/GT.png";
import KKR from "../assets/logos/KKR.png";
import LSG from "../assets/logos/LSG.png";
import MI from "../assets/logos/MI.png";
import MU from "../assets/logos/MU.png";
import PBKS from "../assets/logos/PBKS.png";
import PWI from "../assets/logos/PWI.png";
import RCB from "../assets/logos/RCB.png";
import RM from "../assets/logos/RM.png";
import RPS from "../assets/logos/RPS.png";
import RR from "../assets/logos/RR.png";
import SRH from "../assets/logos/SRH.png";
import questionMark from "../assets/logos/question.png";

// Import sound effects (you'll need to add these files to your project)
import flipSound from "../assets/sounds/card-flip.mp3";
import matchSound from "../assets/sounds/match.mp3";
import winSound from "../assets/sounds/victory.mp3";
import mismatchSound from "../assets/sounds/error.mp3";

const logoMap = {
  "ASNL.png": ASNL,
  "CHSE.png": CHSE,
  "CSK.png": CSK,
  "DC.png": DC,
  "DCH.png": DCH,
  "FCB.png": FCB,
  "GT.png": GT,
  "KKR.png": KKR,
  "LSG.png": LSG,
  "MI.png": MI,
  "MU.png": MU,
  "PBKS.png": PBKS,
  "PWI.png": PWI,
  "RCB.png": RCB,
  "RM.png": RM,
  "RPS.png": RPS,
  "RR.png": RR,
  "SRH.png": SRH,
};

const teamLogos = Object.keys(logoMap);

const GameBoard = () => {
  const [gridSize, setGridSize] = useState(4);
  const [flipped, setFlipped] = useState([]);
  const [cards, setCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [won, setWon] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showMismatchAnimation, setShowMismatchAnimation] = useState(false);

  // Audio refs
  const flipAudioRef = useRef(null);
  const matchAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const mismatchAudioRef = useRef(null);

  // Timer states
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Best scores state
  const [bestScores, setBestScores] = useState({});
  const [isNewBestTime, setIsNewBestTime] = useState(false);

  // Initialize audio elements
  useEffect(() => {
    flipAudioRef.current = new Audio(flipSound);
    matchAudioRef.current = new Audio(matchSound);
    winAudioRef.current = new Audio(winSound);
    mismatchAudioRef.current = new Audio(mismatchSound);
    
    // Preload sounds
    flipAudioRef.current.load();
    matchAudioRef.current.load();
    winAudioRef.current.load();
    mismatchAudioRef.current.load();

    return () => {
      // Clean up audio elements
      flipAudioRef.current = null;
      matchAudioRef.current = null;
      winAudioRef.current = null;
      mismatchAudioRef.current = null;
    };
  }, []);

  // Load best scores from localStorage on component mount
  useEffect(() => {
    const savedBestScores = localStorage.getItem("memoryMatchBestScores");
    if (savedBestScores) {
      setBestScores(JSON.parse(savedBestScores));
    }

    // Check user's sound preference from localStorage
    const savedSoundPref = localStorage.getItem("memoryMatchSoundPref");
    if (savedSoundPref !== null) {
      setSoundEnabled(savedSoundPref === "true");
    }
  }, []);

  // Save sound preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("memoryMatchSoundPref", soundEnabled);
  }, [soundEnabled]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds === undefined) return "--:--";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const playSound = (soundRef) => {
    if (soundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0; // Rewind to start
      soundRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 6) {
      setGridSize(size);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = totalCards / 2;

    const selectedImages = [...teamLogos]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairCount);

    const shuffledCards = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({ id: index, image }));

    setWon(false);
    setShowWinModal(false);
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setMoves(0);
    setMatchCount(0);
    setIsAnimating(true);
    setIsNewBestTime(false);
    setShowMatchAnimation(false);
    setShowMismatchAnimation(false);

    // Reset and stop timer
    setSeconds(0);
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].image === cards[secondId].image) {
      // Match found
      playSound(matchAudioRef);
      setShowMatchAnimation(true);
      setTimeout(() => setShowMatchAnimation(false), 1000);
      
      setMatched([...matched, firstId, secondId]);
      setMatchCount((prev) => prev + 1);
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 300);
    } else {
      // No match
      playSound(mismatchAudioRef);
      setShowMismatchAnimation(true);
      setTimeout(() => setShowMismatchAnimation(false), 1000);
      
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 800);
    }
  };

  const handleClick = (id) => {
    if (disabled || won || flipped.includes(id) || matched.includes(id)) return;

    // Play flip sound
    playSound(flipAudioRef);

    // Start timer on first card click
    if (!isTimerRunning && matched.length === 0 && flipped.length === 0) {
      setIsTimerRunning(true);
    }

    if (flipped.length === 0) {
      setFlipped([id]);
    } else if (flipped.length === 1) {
      setDisabled(true);
      setMoves((m) => m + 1);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || matched.includes(id);
  const isSolved = (id) => matched.includes(id);

  // Handle timer
  useEffect(() => {
    if (isTimerRunning && !won) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, won]);

  // Check if game is won and update best time if necessary
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setWon(true);
      setIsTimerRunning(false);
      playSound(winAudioRef);

      // Check if this is a new best time for this grid size
      const gridSizeKey = `grid${gridSize}`;
      const currentBestTime = bestScores[gridSizeKey];

      if (!currentBestTime || seconds < currentBestTime) {
        // Update best time
        const newBestScores = {
          ...bestScores,
          [gridSizeKey]: seconds,
        };

        setBestScores(newBestScores);
        setIsNewBestTime(true);

        // Save to localStorage
        localStorage.setItem(
          "memoryMatchBestScores",
          JSON.stringify(newBestScores)
        );
      }

      setShowWinModal(true);
    }
  }, [matched, cards, bestScores, gridSize, seconds]);

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  // Get current best time for display
  const currentBestTime = bestScores[`grid${gridSize}`];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4 sm:px-6 py-5 sm:py-12">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 w-full max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-700">
            Memory Match
          </span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base flex items-center gap-1">
          <Award className="w-4 h-4" /> Match all pairs to win
        </p>
      </div>

      {/* Game Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full max-w-6xl">
        {/* Left Controls - Matches, Moves & Timer */}
        <div className="hidden lg:flex flex-col gap-4 w-48">
          <div className="text-center px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Time
            </p>
            <p className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
              <Clock className="w-5 h-5" /> {formatTime(seconds)}
            </p>
          </div>

          <div className="text-center px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Moves
            </p>
            <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
              <Gauge className="w-5 h-5" /> {moves}
            </p>
          </div>

          <div className="text-center px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Matches
            </p>
            <p className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5" /> {matchCount}/{cards.length / 2}
            </p>
          </div>

          <div className="text-center px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Best Time ({gridSize}×{gridSize})
            </p>
            <p className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
              <Medal className="w-5 h-5" /> {formatTime(currentBestTime)}
            </p>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4" /> Sound On
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" /> Sound Off
              </>
            )}
          </button>
        </div>

        {/* Game Board */}
        <div className="flex flex-col items-center">
          {/* Mobile Controls */}
          <div className="lg:hidden flex flex-wrap sm:flex-row justify-between items-center w-full gap-4 mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
            <div className="w-full">
              <label
                htmlFor="gridSize"
                className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
              >
                <Settings className="w-4 h-4" /> Difficulty
              </label>
              <div className="flex items-center gap-4">
                <input
                  className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-500"
                  type="range"
                  id="gridSize"
                  min={2}
                  max={6}
                  value={gridSize}
                  onChange={handleGridSizeChange}
                />
                <span className="text-sm font-medium text-gray-700 min-w-[40px]">
                  {gridSize}×{gridSize}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full flex-wrap justify-center">
              <div className="text-center px-3 py-2 bg-blue-50/80 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Time
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {formatTime(seconds)}
                </p>
              </div>

              <div className="text-center px-3 py-2 bg-indigo-50/80 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Moves
                </p>
                <p className="text-xl font-bold text-indigo-600">{moves}</p>
              </div>

              <div className="text-center px-3 py-2 bg-emerald-50/80 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Matches
                </p>
                <p className="text-xl font-bold text-emerald-600">
                  {matchCount}
                </p>
              </div>

              <div className="text-center px-3 py-2 bg-amber-50/80 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Best
                </p>
                <p className="text-xl font-bold text-amber-600">
                  {formatTime(currentBestTime)}
                </p>
              </div>

              {/* Mobile Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-center px-3 py-2 bg-gray-50/80 rounded-lg flex items-center justify-center"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-indigo-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Game Grid */}
          <div
            className={`grid gap-3 sm:gap-4 mb-6 transition-all duration-300 relative ${
              isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"
            }`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              width: `min(100%, ${gridSize * 5.5}rem)`,
            }}
          >
            {/* Match Animation */}
            {showMatchAnimation && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-full w-full bg-emerald-500/20"></div>
              </div>
            )}

            {/* Mismatch Animation */}
            {showMismatchAnimation && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-full w-full bg-red-500/20"></div>
              </div>
            )}

            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleClick(card.id)}
                className={`aspect-square flex items-center justify-center rounded-2xl cursor-pointer transition-transform duration-300 ease-in-out relative
                    ${
                      isFlipped(card.id)
                        ? isSolved(card.id)
                          ? "bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 shadow-emerald-300 shadow-inner"
                          : "bg-gradient-to-br from-indigo-300 via-indigo-500 to-indigo-700 shadow-indigo-300 shadow-inner"
                        : "bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 hover:shadow-xl hover:border-indigo-300"
                    }
                    ${
                      flipped.includes(card.id)
                        ? "rotate-y-180"
                        : matched.includes(card.id)
                        ? "scale-95"
                        : "hover:scale-[1.04]"
                    }
                  `}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={
                      isFlipped(card.id) ? logoMap[card.image] : questionMark
                    }
                    alt={
                      isFlipped(card.id)
                        ? card.image.split(".")[0]
                        : "hidden-logo"
                    }
                    className={`w-3/4 h-3/4 object-contain transition-all duration-300 ${
                      isFlipped(card.id) ? "opacity-100" : "opacity-90"
                    }`}
                  />
                  {!isFlipped(card.id) && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-100/30 rounded-xl mix-blend-overlay" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Reset Button */}
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            {won ? (
              <>
                Play Again <MoveRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Reset Game <RotateCcw className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Controls - Difficulty */}
        <div className="hidden lg:flex flex-col w-48 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4">
            <label
              htmlFor="gridSize"
              className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
            >
              <Settings className="w-4 h-4" /> Difficulty
            </label>
            <div className="flex flex-col items-center gap-2">
              <input
                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-500"
                type="range"
                id="gridSize"
                min={2}
                max={6}
                value={gridSize}
                onChange={handleGridSizeChange}
              />
              <span className="text-sm font-medium text-gray-700">
                {gridSize}×{gridSize} Grid
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 text-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-scale-in">
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="mb-1">
              You matched all pairs in{" "}
              <span className="font-bold">{moves}</span> moves!
            </p>
            <p className="mb-2">
              Time: <span className="font-bold">{formatTime(seconds)}</span>
            </p>

            {isNewBestTime && (
              <div className="bg-white/20 rounded-lg p-3 mb-4 flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <p className="font-bold text-white">New Best Time!</p>
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={initializeGame}
                className="px-6 py-2 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition-all font-medium flex items-center justify-center gap-2"
              >
                Play Again <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowWinModal(false)}
                className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all font-medium"
              >
                View Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;