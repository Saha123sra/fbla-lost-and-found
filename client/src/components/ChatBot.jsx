// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, X } from 'lucide-react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi there! 👋 I'm the Lost Dane Found Assistant.\n\n• Search for lost items\n• Report found items\n• Understand the claim process\n• Answer FAQs\n\nHow can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();

    if (lower.match(/^(hi|hello|hey)/)) {
      return "Hello! 👋 Are you looking for a lost item or reporting something you found?";
    }

    if (lower.includes('lost') || lower.includes('find')) {
      return "To find a lost item:\n\n1️⃣ Go to **Browse Items**\n2️⃣ Use filters to search\n3️⃣ Submit a claim if you find a match\n\nWant me to take you there?";
    }

    if (lower.includes('found') || lower.includes('report')) {
      return "Thanks for helping! 🐕\n\nGo to **Report Found Item**, upload a photo, and add details. We'll handle the rest!";
    }

    if (lower.includes('claim')) {
      return "Claim process:\n\n• Submit proof of ownership\n• Admin reviews (24 hrs)\n• Get pickup instructions by email\n• Bring your student ID";
    }

    if (lower.includes('where') || lower.includes('location')) {
      return "📍 Lost & Found: Main Office, Room 101\n🕐 7:30 AM – 4:00 PM";
    }

    return "I can help with:\n\n• Lost items\n• Found items\n• Claims\n• Location\n\nWhat do you need?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(userMessage);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 800);
  };

  const quickReplies = [
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
                     h-[60vh] sm:h-[380px] md:h-[400px] lg:h-[450px]"
        >
          <div className="relative bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-full"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="bg-navy-700 text-white p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-skyblue-300 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-navy-800" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Lost Dane Found Assistant</h2>
                <p className="text-xs text-skyblue-200">Always available</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[80%]">
                    <div
                      className={`px-4 py-3 rounded-2xl whitespace-pre-line break-words
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
                <div className="text-sm text-gray-400">Assistant is typing…</div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2 flex flex-wrap gap-2 overflow-x-auto">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => setInput(reply)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message…"
                className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                onClick={handleSend}
                className="bg-navy-600 text-white p-3 rounded-full hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <Send size={16} />
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