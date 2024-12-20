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

  const [displayedResponse, setDisplayedResponse] = useState([]);
  const [input, setInput] = useState("Hello Shaheb Ali, How are you?");
  const [showLip, setShowLip] = useState(false);
  const [aiVoice, setAiVoice] = useState(false);
  const [isListeningState, setIsListeningState] = useState(false);

  useEffect(() => {
    if (response) {
      setDisplayedResponse([]); // Always set as an array

      setAiVoice(true);
      setShowLip(false);
      setIsListeningState(false);

      // Regex to identify code blocks wrapped in triple backticks
      const parts = response.split(/(```[\s\S]*?```)/);
      const formattedResponse = [];

      let currentIndex = 0;

      const intervalId = setInterval(() => {
        if (currentIndex < parts.length) {
          const part = parts[currentIndex];
          if (part.startsWith("```") && part.endsWith("```")) {
            // It's a code block; strip the backticks and push
            formattedResponse.push({
              type: "code",
              content: part.slice(3, -3),
            });
          } else {
            // It's plain text
            formattedResponse.push({
              type: "text",
              content: part,
            });
          }
          currentIndex++;
          // Update displayed response
          setDisplayedResponse([...formattedResponse]);
        } else {
          clearInterval(intervalId);
        }
      }, 200); // Adjust timing between parts as needed

      // Cleanup interval on unmount or response change
      return () => clearInterval(intervalId);
    } else {
      // Clear displayed response if no response
      setDisplayedResponse([]);
    }
  }, [response]);

  function resumeRecognition() {
    setShowLip(true);
    setIsListeningState(true);
    setDisplayedResponse("");
    recognition.start(); // Restart listening
    console.log("Speech recognition listening.");
  }

  recognition.onend = () => {
    setShowLip(false);
    setAiVoice(false);
    setIsListeningState(false);
    console.log("Speech recognition ended.");
  };

  function pauseRecognition() {
    recognition.stop();

    setShowLip(false);
    setIsListeningState(false);
    console.log("Speech recognition paused.");
  }

  function stopSpeakingAndStartNew() {
    stopSpeaking();
    setDisplayedResponse([]);
    setIsListeningState(false);
    setShowLip(false);
    setAiVoice(false);
    setInput("");
    window.location.reload();
  }

  return (
    <div className="main">
      <div className="mamuContainer">
        <img src={va} className="mamu" alt="Virtual Assistant" />
      </div>

      <span>Mamu 1.0 is your Virtual Assistant, Ask Anything!</span>

      <button>
        {aiVoice ? (
          <>
            <div>
              <img
                src={aiVoiceImg}
                className={aiVoice ? "show aivoice" : "hide aivoice"}
                alt="AI Speaking"
              />
            </div>
            <div>
              <CiMicrophoneOff
                className="icon"
                onClick={stopSpeakingAndStartNew}
              />
            </div>
          </>
        ) : isListeningState ? (
          <>
            <div>
              <img src={speak} className="speak" alt="Listening..." />
            </div>
          </>
        ) : (
          <CiMicrophoneOn className="icon" onClick={resumeRecognition} />
        )}
      </button>

      <div className="response">
        {Array.isArray(displayedResponse) &&
          displayedResponse.map((part, index) => {
            if (part.type === "code") {
              return (
                <pre className="code-block" key={index}>
                  <code>{part.content}</code>
                </pre>
              );
            }
            return <p key={index}>{part.content}</p>;
          })}
      </div>
    </div>
  );
};

export default App;
