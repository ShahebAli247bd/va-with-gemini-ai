import { Suspense, useContext, useEffect, useState } from "react";
import lip from "./assets/lip.gif";
import "./App.css";
import va from "./assets/ai.png";
import aiVoiceImg from "./assets/aiVoice.gif";
import speak from "./assets/speak.gif";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";
import { dataContext } from "./context/UserContext";

const App = () => {
  let {
    transcript,
    response,
    recognition,
    isListening,
    setIsListening,
    stopSpeaking,
  } = useContext(dataContext);

  const [displayedResponse, setDisplayedResponse] = useState("");
  const [input, setInput] = useState("Hello Shaheb Ali, How are you?");
  const [showLip, setShowLip] = useState(false);
  const [aiVoice, setAiVoice] = useState(false);
  const [isListeningState, setIsListeningState] = useState(false);

  useEffect(() => {
    if (response) {
      setAiVoice(true);
      setShowLip(false);
      setIsListeningState(false);
      const words = response.split(" ");
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedResponse((prev) => prev + " " + words[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 200); // Adjust timing between words as needed

      return () => clearInterval(intervalId);
    }
    setDisplayedResponse("");
  }, [response]);

  function resumeRecognition() {
    setShowLip(true);
    setIsListeningState(true);
    setDisplayedResponse("");
    recognition.start(); // Restart listening
    console.log("Speech recognition resumed.");
  }

  recognition.onend = () => {
    setShowLip(false);
    setAiVoice(false);
    setIsListeningState(false);
    console.log("Speech recognition ended.");
  };

  function pauseRecognition() {
    recognition.stop(); // Stop listening temporarily
    setShowLip(false);
    setIsListeningState(false);
    console.log("Speech recognition paused.");
  }

  return (
    <div className="main">
      <div className="mamuContainer">
        <img src={va} className="mamu" alt="Virtual Assistant" />
      </div>

      <span>Mamu 1.0 is your Virtual Assistant, Ask Anything!</span>

      {}

      <button>
        {aiVoice ? (
          <img
            src={aiVoiceImg}
            className={aiVoice ? "show aivoice" : "hide aivoice"}
            alt="AI Speaking"
          />
        ) : isListeningState ? (
          <img src={speak} className="speak" alt="Listening..." />
        ) : (
          <Suspense fallback={<div>Listening...</div>}>
            <CiMicrophoneOn className="icon" onClick={resumeRecognition} />
          </Suspense>
        )}
      </button>
      <button>
        <CiMicrophoneOff className="icon" onClick={pauseRecognition} />
      </button>
      <Suspense fallback={<div>Thinking...</div>}>
        <div className="response">{displayedResponse}</div>
      </Suspense>
    </div>
  );
};

export default App;
