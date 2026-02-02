// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FloatingChatbot = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize greeting message with translations
  useEffect(() => {
    if (!initialized) {
      setMessages([
        {
          role: 'bot',
          text: t('chatbot.greeting')
        }
      ]);
      setInitialized(true);
    }
  }, [t, initialized]);

  // Update greeting when language changes
  useEffect(() => {
    if (initialized && messages.length === 1 && messages[0].role === 'bot') {
      setMessages([
        {
          role: 'bot',
          text: t('chatbot.greeting')
        }
      ]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Multilingual bot responses
  const getBotResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();

    // Get response key based on user message pattern
    const getResponseKey = () => {
      // Greetings
      if (lower.match(/^(hi|hello|hey|good morning|good afternoon|hola|bonjour|नमस्ते|你好)/)) {
        return 'greeting';
      }

      // User is SEARCHING for items
      if (lower.match(/are there|is there|any .*(found|available|lost)|looking for|search|browse|find my|where.*(my|is)|have you seen|buscar|chercher|खोज|搜索/)) {
        return 'search';
      }

      // User LOST something
      if (lower.match(/i lost|i've lost|lost my|missing|perdi|perdido|j'ai perdu|खो गया|丢失/)) {
        return 'lost';
      }

      // User FOUND something
      if (lower.match(/i found|found a|found an|report.*(found|item)|turn in|submit.*found|want to report|encontré|j'ai trouvé|मिला|找到/)) {
        return 'found';
      }

      // Claim process
      if (lower.match(/claim|how do i get|pick up|retrieve|reclamar|réclamer|दावा|认领/)) {
        return 'claim';
      }

      // Location questions
      if (lower.match(/where|location|office|hours|donde|où|कहां|哪里|horario|heures/)) {
        return 'location';
      }

      // How does it work
      if (lower.match(/how.*(work|use)|como funciona|comment ça marche|कैसे काम|怎么用/)) {
        return 'howItWorks';
      }

      // Thanks
      if (lower.match(/thank|thanks|thx|gracias|merci|धन्यवाद|谢谢/)) {
        return 'thanks';
      }

      return 'default';
    };

    const responseKey = getResponseKey();
    return t(`chatbot.responses.${responseKey}`);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false); // Hide suggestions after first message

    setTimeout(() => {
      const response = getBotResponse(userMessage);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 800);
  };

  // Get quick replies from translations
  const quickReplies = t('chatbot.suggestions') || [
    "I lost something",
    "I found something",
    "How does this work?",
    "Where is Lost & Found?"
  ];

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50
                     w-[90vw] sm:w-[360px] md:w-[380px] lg:w-[400px]
                     h-[60vh] sm:h-[380px] md:h-[400px] lg:h-[450px]
                     max-h-[calc(100vh-120px)]"
        >
          <div className="relative bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden h-full">

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-full z-10"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="bg-navy-700 text-white p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-skyblue-300 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-navy-800" />
              </div>
              <div>
                <h2 className="font-bold text-sm">{t('chatbot.title')}</h2>
                <p className="text-xs text-skyblue-200">{t('chatbot.alwaysAvailable')}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%]">
                    <div
                      className={`px-4 py-3 rounded-2xl whitespace-pre-line break-words text-sm leading-relaxed
                        ${msg.role === 'user'
                          ? 'bg-navy-600 text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'}`
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="text-sm text-gray-400 py-2">{t('chatbot.typing')}</div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Collapsible Quick Replies */}
            <div className="border-t border-gray-100">
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-500 hover:bg-gray-50 transition"
              >
                <span>{t('chatbot.suggestionsLabel')}</span>
                {showSuggestions ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>

              {showSuggestions && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(reply);
                        setShowSuggestions(false);
                      }}
                      className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                className="bg-navy-600 text-white p-2.5 rounded-full hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-500 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-navy-600 hover:bg-navy-700 text-white p-4 rounded-full shadow-lg transition focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
};

export default FloatingChatbot;
