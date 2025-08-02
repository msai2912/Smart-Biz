import React, { useState, useRef, useEffect } from 'react';
import ChatbotService from '../services/chatbotService';
import './Chatbot.css';

const Chatbot = ({ businessInfo, isDemo = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm here to help you with any questions about ${businessInfo.name}. How can I assist you today?`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // If it's a demo, use enhanced fallback responses
      if (isDemo) {
        setTimeout(() => {
          const botResponse = ChatbotService.generateFallbackResponse(inputValue, businessInfo);
          const formattedResponse = ChatbotService.formatResponse(botResponse);
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: formattedResponse,
            isBot: true,
            timestamp: new Date()
          }]);
          setIsTyping(false);
        }, 1500);
      } else {
        // Use Gemini AI service
        const result = await ChatbotService.sendMessage(
          inputValue, 
          businessInfo, 
          messages.slice(-5) // Send last 5 messages for context
        );
        
        if (result.success) {
          const formattedResponse = ChatbotService.formatResponse(result.response);
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: formattedResponse,
            isBot: true,
            timestamp: new Date()
          }]);
        } else {
          throw new Error(result.error || 'Failed to get response');
        }
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      // Fallback to enhanced responses even in non-demo mode if API fails
      const fallbackResponse = ChatbotService.generateFallbackResponse(inputValue, businessInfo);
      const formattedResponse = ChatbotService.formatResponse(fallbackResponse);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: formattedResponse,
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Chat Button */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-info">
              <div className="business-avatar">
                {businessInfo.name.charAt(0)}
              </div>
              <div className="header-text">
                <h4>{businessInfo.name}</h4>
                <span className="status">● Online</span>
              </div>
            </div>
            <button 
              className="close-chat"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isBot ? 'bot' : 'user'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <div className="input-container">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                disabled={isTyping}
              />
              <button 
                onClick={sendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="send-button"
              >
                ➤
              </button>
            </div>
            <div className="input-footer">
              <span>Powered by AI • Press Enter to send</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
