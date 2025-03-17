import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './VirtualAssistant.module.css';

const VirtualAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Bonjour, je suis votre assistant virtuel. Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // New states for fallback feedback functionality
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  // Save the user's message that triggered a fallback so it can be sent with feedback
  const [fallbackMessage, setFallbackMessage] = useState('');

  // Suggestions list
  const suggestions = [
    "How to get started?",
    "How do I make a transaction?",
    "What are the fees?",
    "How do I contact support?"
  ];

  // State to control suggestions visibility
  const [showSuggestions, setShowSuggestions] = useState(true);

  const chatBodyRef = useRef(null);

  // Toggle the chat window open/close, resetting suggestions when opening the chat
  const toggleChat = () => {
    if (!isOpen) {
      setShowSuggestions(true);
    }
    setIsOpen(!isOpen);
  };

  // Function to submit feedback via the /feedback endpoint
  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim() || !fallbackMessage) return;
    try {
      await axios.post('http://localhost:5000/feedback', {
        message: fallbackMessage,
        feedback: feedbackText.trim()
      });
      // Optionally, add a confirmation message
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: 'Merci pour votre feedback.' }
      ]);
    } catch (error) {
      console.error('Error sending feedback:', error);
    } finally {
      // Clear feedback state and hide the input
      setShowFeedback(false);
      setFeedbackText('');
      setFallbackMessage('');
    }
  };

  // Updated sendMessage function to accept an optional message text (for suggestions)
  const sendMessage = async (messageText) => {
    const messageToSend = messageText !== undefined ? messageText : input.trim();
    if (!messageToSend) return;

    // If the feedback input is visible, clear it (discard unsent feedback) before sending a new message
    if (showFeedback) {
      setShowFeedback(false);
      setFeedbackText('');
      setFallbackMessage('');
    }

    // Capture and display the user's message
    const userMessage = { sender: 'user', text: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    // Clear the input if the user typed manually
    if (messageText === undefined) setInput('');
    setLoading(true);

    try {
      // POST the message to the Flask chatbot endpoint
      const response = await axios.post('http://localhost:5000/chat', {
        message: messageToSend
      });

      // Retrieve the chatbot's response and tag
      const assistantReply = response.data.response;
      const tag = response.data.tag;
      
      // If the chatbot's tag is fallback, show the feedback input and store the triggering message
      if (tag === 'fallback') {
        setShowFeedback(true);
        setFallbackMessage(messageToSend);
      } else {
        // Hide feedback input for any non-fallback responses
        setShowFeedback(false);
        setFeedbackText('');
        setFallbackMessage('');
      }

      // Display the assistant's reply
      const assistantMessage = { sender: 'assistant', text: assistantReply };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching assistant response', error);
      const errorMessage = {
        sender: 'assistant',
        text: 'Désolé, une erreur est survenue.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press in the main chat input field
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // When a suggestion is clicked, send that as a message
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  // Auto-scroll the chat to the bottom whenever messages update
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <button
        className={styles.chatToggleButton}
        onClick={toggleChat}
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {isOpen ? (
          <i className="bi bi-x-lg"></i>
        ) : (
          <i className="bi bi-robot"></i>
        )}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <i className="bi bi-robot" style={{ marginRight: '8px' }}></i>
            Assistant Virtuel
          </div>
          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${msg.sender === 'user' ? styles.userMessage : styles.assistantMessage}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className={styles.loadingMessage}>Assistant réfléchit...</div>}
          </div>

          {/* Conditionally render feedback input if fallback was triggered */}
          {showFeedback && (
            <div className={styles.feedbackContainer}>
              <input
                type="text"
                placeholder="Votre feedback sur la réponse ..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className={styles.feedbackInput}
              />
              <button onClick={handleSubmitFeedback} className={styles.feedbackButton}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          )}

          {/* Conditionally render suggestions if they are not hidden */}
          {showSuggestions && (
            <div className={styles.suggestionsContainer}>
              <div className={styles.suggestionsHeader}>
                <span>Suggestions</span>
                <button
                  className={styles.suggestionsCloseButton}
                  onClick={() => setShowSuggestions(false)}
                  aria-label="Hide suggestions"
                >
                  X
                </button>
              </div>
              {suggestions.map((sugg, index) => (
                <div 
                  key={index} 
                  className={styles.suggestionItem} 
                  onClick={() => handleSuggestionClick(sugg)}
                >
                  {sugg}
                </div>
              ))}
            </div>
          )}

          <div className={styles.chatFooter}>
            <input
              type="text"
              placeholder="Tapez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.chatInput}
            />
            <button onClick={() => sendMessage()} className={styles.sendButton}>
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualAssistant;
