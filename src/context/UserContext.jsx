import { createContext, useEffect, useState, useRef } from "react";
import run from "../../gemni";

export const dataContext = createContext();

function UserContext({ children }) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState("");

  // Initialize speech recognition
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = true;

  // Handle speech recognition results
  recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcriptText = event.results[current][0].transcript;
    setTranscript(transcriptText);

    // Send transcript to Gemini AI when speech ends
    if (event.results[current].isFinal) {
      handleGeminiResponse(transcriptText);
    }
  };

  // Handle errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  // Function to handle Gemini AI response
  const handleGeminiResponse = async (prompt) => {
    try {
      const aiResponse = await run(prompt);
      // Clean the response by removing unwanted characters
      const cleanResponse = aiResponse.replace(/[*\\\/]/g, "").trim();
      setResponse(cleanResponse);
      console.log(cleanResponse);
      // Optional: Convert response to speech
      const speech = new SpeechSynthesisUtterance(cleanResponse);
      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.error("Error getting Gemini response:", error);
    }
  };
  // Function to stop speech synthesis
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };

  const value = {
    transcript,
    response,
    recognition,
    isListening,
    setIsListening,
    stopSpeaking,
  };

  return (
    <div>
      <dataContext.Provider value={value}>{children}</dataContext.Provider>
    </div>
  );
}

export default UserContext;
