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

    // Greetings
    if (lower.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
      return "Hello! 👋 Are you looking for a lost item or reporting something you found?";
    }

    // User is SEARCHING for items (asking if something exists, looking for something)
    if (lower.match(/are there|is there|any .*(found|available|lost)|looking for|search|browse|find my|where.*(my|is)|have you seen/)) {
      return "To search for items:\n\n1️⃣ Go to **Browse Items**\n2️⃣ Use filters (category, date, location)\n3️⃣ Found a match? Submit a claim!\n\n🔗 [Browse Items](/browse)";
    }

    // User LOST something
    if (lower.includes('i lost') || lower.includes("i've lost") || lower.includes('lost my') || lower.includes('missing')) {
      return "Sorry to hear that! 😟\n\nHere's what to do:\n\n1️⃣ **Browse Items** to see if it's been found\n2️⃣ **Submit a Lost Item Request** so we can notify you if it turns up\n\n🔗 [Browse Items](/browse)\n🔗 [Report Lost Item](/request)";
    }

    // User FOUND something and wants to report it
    if (lower.match(/i found|found a|found an|report.*(found|item)|turn in|submit.*found|want to report/)) {
      return "Thanks for helping! 🐕\n\nGo to **Report Found Item**, upload a photo, and add details. We'll handle the rest!\n\n🔗 [Report Found Item](/report)";
    }

    // Claim process questions
    if (lower.includes('claim') || lower.includes('how do i get') || lower.includes('pick up') || lower.includes('retrieve')) {
      return "Claim process:\n\n1️⃣ Find your item in Browse Items\n2️⃣ Click 'Claim' and provide proof of ownership\n3️⃣ Admin reviews within 24 hours\n4️⃣ Get pickup instructions by email\n5️⃣ Bring your student ID to collect\n\n🔗 [My Claims](/my-claims)";
    }

    // Location questions
    if (lower.includes('where') || lower.includes('location') || lower.includes('office') || lower.includes('hours')) {
      return "📍 **Lost & Found Office**\nMain Office, Room 101\n\n🕐 **Hours**\nMonday - Friday: 7:30 AM – 4:00 PM";
    }

    // How does it work
    if (lower.includes('how') && (lower.includes('work') || lower.includes('use'))) {
      return "Here's how Lost Dane Found works:\n\n🔍 **Lost something?**\nBrowse items or submit a lost item request\n\n📦 **Found something?**\nReport it so the owner can find it\n\n✅ **Claiming**\nSubmit proof, get verified, pick up!";
    }

    // Thanks
    if (lower.match(/thank|thanks|thx/)) {
      return "You're welcome! 🎉 Let me know if you need anything else.";
    }

    // Default fallback
    return "I can help with:\n\n🔍 Searching for lost items\n📦 Reporting found items\n✅ Claim process\n📍 Office location & hours\n\nWhat would you like to know?";
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