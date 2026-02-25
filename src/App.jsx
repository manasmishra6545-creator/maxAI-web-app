import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, Send, Compass, Code, PenTool, Brain, Mic, Trash2, StopCircle, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { simulateAIResponse } from './aiMock'; // We'll create this module later

export default function App() {
  // Load messages from LocalStorage if available
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('maxAI_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Load Auto-Speak preference
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem('maxAI_autospeak');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-save messages to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('maxAI_history', JSON.stringify(messages));
  }, [messages]);

  // Auto-save Auto-Speak preference
  useEffect(() => {
    localStorage.setItem('maxAI_autospeak', JSON.stringify(autoSpeak));
  }, [autoSpeak]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- Voice Input (Speech Recognition) ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => prev + " " + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support speech recognition.");
      }
    }
  };

  // --- Voice Output (Speech Synthesis) ---
  const speakResponse = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Slightly faster for AI feel
      utterance.pitch = 1.1; // Slightly higher

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // --- General Actions ---
  const clearChat = () => {
    setMessages([]);
    stopSpeaking();
  };

  const handleSend = async (text) => {
    const query = text || inputValue.trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and responding
    const aiResponse = await simulateAIResponse(query);

    setIsTyping(false);
    const newMsg = {
      id: Date.now() + 1,
      role: 'ai',
      content: aiResponse
    };
    setMessages(prev => [...prev, newMsg]);

    // Auto-read response if user was recently using voice or just default to read out loud
    // (Here we'll always read it out unless they stopped it, but you can toggle this)
    if (autoSpeak) {
      speakResponse(aiResponse);
    }

    // Auto focus back on input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exploreCards = [
    { icon: <Compass size={24} />, title: "Explain quantum computing", desc: "Break it down in simple terms for a 10 year old.", q: "Explain quantum computing to me like I'm 10." },
    { icon: <Code size={24} />, title: "Debug my React issue", desc: "Get help fixing useEffect dependency array looping.", q: "Why is my useEffect causing an infinite loop in React?" },
    { icon: <PenTool size={24} />, title: "Draft a sci-fi story", desc: "Set in a dystopian future where AI is prohibited.", q: "Write a short sci-fi story about a world without AI." },
    { icon: <Brain size={24} />, title: "Plan a workout routine", desc: "A 4-day split for muscle hypertrophy.", q: "Create a 4-day workout split focused on building muscle." },
  ];

  return (
    <div className="app-container">
      <header>
        <div className="brand-title">
          <div className="brand-icon">
            <Bot color="white" size={20} />
          </div>
          max<span className="text-gradient">AI</span>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setAutoSpeak(!autoSpeak);
            }}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}
            title={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
          >
            {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} color="#a1a1aa" />}
            <span style={{ display: 'none' /* hidden for mobile if necessary, or keep visible */ }}>
              {autoSpeak ? 'Speaking: On' : 'Speaking: Off'}
            </span>
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <StopCircle size={16} /> Stop Speaking
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#ec4899', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}
            >
              <Trash2 size={16} /> Clear Chat
            </button>
          )}
        </div>
      </header>

      <main>
        {messages.length === 0 ? (
          <motion.div
            className="explore-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="hero-title">
              Hello, I'm <span className="text-gradient">maxAI</span>
            </h1>
            <p className="hero-subtitle">
              Your ultimate intelligence nexus. Start a conversation or pick a topic below to explore the limits of my knowledge.
            </p>

            <div className="grid-wrapper">
              {exploreCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  className="explore-card"
                  onClick={() => handleSend(card.q)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                >
                  <div className="card-icon">
                    {card.icon}
                  </div>
                  <div className="card-title">{card.title}</div>
                  <div className="card-desc">{card.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="chat-layout"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="messages-area">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    className={`message-row ${m.role}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="avatar">
                      {m.role === 'ai' ? <Bot size={20} color="white" /> : <User size={20} color="rgba(255,255,255,0.7)" />}
                    </div>
                    <div className="bubble">
                      {m.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i !== m.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <div className="message-row ai">
                  <div className="avatar">
                    <Bot size={20} color="white" />
                  </div>
                  <div className="bubble" style={{ padding: '12px 16px' }}>
                    <div className="typing-indicator">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}

        {/* Global Input Area fixed at bottom of main view if chat active, or bottom of screen if explore */}
        <div style={{ width: '100%', maxWidth: '900px', marginTop: messages.length === 0 ? '60px' : '0' }}>
          <div className="input-container glass-panel">
            <textarea
              ref={inputRef}
              className="input-box"
              placeholder="Ask maxAI anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ paddingRight: '100px' }} // extra space for mic and send
            />

            <div style={{ position: 'absolute', right: '12px', bottom: '10px', display: 'flex', gap: '8px' }}>
              <button
                className={isListening ? "send-btn pulse-red" : "send-btn"}
                onClick={toggleListening}
                style={{ background: isListening ? '#ef4444' : 'var(--surface-secondary)', color: 'white' }}
                title="Voice Input"
              >
                <Mic size={16} />
              </button>
              <button
                className="send-btn"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() && !isTyping}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
