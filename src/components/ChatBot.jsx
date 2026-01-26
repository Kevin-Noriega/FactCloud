import { useState, useRef, useEffect } from "react";
import {
  ChatDots,
  X,
  Send,
  Person
} from "react-bootstrap-icons";
import "../styles/Chatbot.css";
import { chatbotResponses } from "../utils/ChatBot";
import ChatbotAvatar from "../img/LogoFC.png";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! ¿Te puedo ayudar en algo?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const findBestResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();
    
    for (const [keywords, response] of Object.entries(chatbotResponses)) {
      const keywordArray = keywords.split("|");
      if (keywordArray.some(keyword => messageLower.includes(keyword))) {
        return response;
      }
    }

    return "Lo siento, no entendí tu pregunta. ¿Podrías reformularla? También puedes contactar a nuestro equipo de soporte en soporte@factcloud.com o llamar al +57 300 123 4567.";
  };

  const handleSendMessage = (customMessage = null) => {
    const messageText = customMessage || inputValue;
    if (!messageText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setShowOptions(false);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = findBestResponse(messageText);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOptionClick = (option) => {
    handleSendMessage(option);
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-float-btn" onClick={() => setIsOpen(true)}>
          <ChatDots size={28} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-window-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-header">
                <Person size={24} />
              </div>
              <div className="chatbot-header-text">
                <h4>Asistente de FactCloud</h4>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="chatbot-window-body">
            <div className="chatbot-messages-container">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.sender}`}>
                  {message.sender === "bot" && (
                    <div className="message-avatar-img">
                      <Person size={20} />
                    </div>
                  )}
                  <div className="message-bubble-wrapper">
                    <div className="message-bubble-content">
                      <p>{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-message bot">
                  <div className="message-avatar-img">
                    <Person size={20} />
                  </div>
                  <div className="message-bubble-wrapper">
                    <div className="message-bubble-content typing">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {showOptions && messages.length === 1 && (
              <div className="chatbot-options">
                <p className="options-prompt">Deseas recibir información de:</p>
                <button 
                  className="option-btn"
                  onClick={() => handleOptionClick("¿Qué es FactCloud?")}
                >
                  Información (Conocer más sobre FactCloud)
                </button>
                <button 
                  className="option-btn"
                  onClick={() => handleOptionClick("Necesito ayuda con la plataforma")}
                >
                  Soporte (Requieres ayuda con la plataforma)
                </button>
              </div>
            )}
          </div>

          <div className="chatbot-window-footer">
            <div className="chatbot-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="chatbot-text-input"
                placeholder="Escribe tu mensaje..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="chatbot-send-button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="chatbot-privacy-text">
              Este servicio de chat utiliza cookies para interactuar contigo.{" "}
              <a href="/privacidad">política de privacidad</a>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
