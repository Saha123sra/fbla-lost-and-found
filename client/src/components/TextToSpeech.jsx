import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Pause, Play, Square, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Map app language codes to speech synthesis language codes
const languageToSpeechCode = {
  en: ['en-US', 'en-GB', 'en-AU', 'en'],
  es: ['es-ES', 'es-MX', 'es-US', 'es'],
  hi: ['hi-IN', 'hi'],
  fr: ['fr-FR', 'fr-CA', 'fr'],
  zh: ['zh-CN', 'zh-TW', 'zh-HK', 'zh']
};

// Language display names for the UI
const languageNames = {
  en: 'English',
  es: 'Spanish',
  hi: 'Hindi',
  fr: 'French',
  zh: 'Chinese'
};

const TextToSpeech = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(0.85);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef(null);
  const speakingLockRef = useRef(false);

  // Find the best voice for a given language
  const findBestVoice = useCallback((availableVoices, langCode) => {
    const speechCodes = languageToSpeechCode[langCode] || languageToSpeechCode.en;

    // Try each preferred speech code in order
    for (const code of speechCodes) {
      // First try to find a premium/natural voice
      const premiumVoice = availableVoices.find(v =>
        v.lang === code && (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Enhanced'))
      );
      if (premiumVoice) return premiumVoice;

      // Then try exact match
      const exactMatch = availableVoices.find(v => v.lang === code);
      if (exactMatch) return exactMatch;

      // Try prefix match (e.g., 'en' matches 'en-US')
      const prefixMatch = availableVoices.find(v => v.lang.startsWith(code.split('-')[0]));
      if (prefixMatch) return prefixMatch;
    }

    // Fallback to first available voice
    return availableVoices[0];
  }, []);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Select voice based on current app language
      const bestVoice = findBestVoice(availableVoices, language);
      if (bestVoice) {
        setSelectedVoice(bestVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      speakingLockRef.current = false;
    };
  }, [language, findBestVoice]);

  // Update voice when language changes
  useEffect(() => {
    if (voices.length > 0 && !isSpeaking) {
      const bestVoice = findBestVoice(voices, language);
      if (bestVoice) {
        setSelectedVoice(bestVoice);
      }
    }
  }, [language, voices, isSpeaking, findBestVoice]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get readable text from the page
  const getPageText = useCallback(() => {
    const mainContent = document.querySelector('main') || document.body;
    const clone = mainContent.cloneNode(true);

    // Remove elements we don't want to read
    const elementsToRemove = clone.querySelectorAll(
      'script, style, nav, footer, button, [aria-hidden="true"], .sr-only, input, select, textarea, svg, img'
    );
    elementsToRemove.forEach(el => el.remove());

    let text = clone.textContent || clone.innerText;

    // Clean up text
    text = text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/\.(?=[A-Z])/g, '. ')
      .replace(/\!(?=[A-Z])/g, '! ')
      .replace(/\?(?=[A-Z])/g, '? ')
      .replace(/[•·]/g, ', ')
      .replace(/[–—]/g, ', ')
      .trim();

    return text;
  }, []);

  // Start reading
  const startReading = useCallback(() => {
    // Prevent multiple simultaneous calls
    if (speakingLockRef.current) {
      return;
    }

    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // Fully cancel any existing speech
    window.speechSynthesis.cancel();

    // Set lock immediately
    speakingLockRef.current = true;

    const text = getPageText();

    if (!text) {
      alert('No text content found on this page.');
      speakingLockRef.current = false;
      return;
    }

    // Small delay to ensure cancel completes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        speakingLockRef.current = false;
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.error('Speech error:', e);
        }
        setIsSpeaking(false);
        setIsPaused(false);
        speakingLockRef.current = false;
      };

      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [getPageText, selectedVoice, rate]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  // Stop reading
  const stopReading = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    speakingLockRef.current = false;
  }, []);

  // Keyboard shortcut: Ctrl+Shift+S to start/stop reading (works on Mac and Windows)
  // This useEffect must come AFTER startReading and stopReading are defined
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+Shift+S (or Cmd+Shift+S on Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (speakingLockRef.current) {
          stopReading();
        } else {
          startReading();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [startReading, stopReading]);

  // Filter voices for current language
  const currentLanguageVoices = voices.filter(v => {
    const speechCodes = languageToSpeechCode[language] || languageToSpeechCode.en;
    const langPrefix = speechCodes[speechCodes.length - 1]; // Get the base code like 'en', 'es', 'hi', etc.
    return v.lang.startsWith(langPrefix);
  });

  // Group voices by region/variant
  const primaryVoices = currentLanguageVoices.filter(v => {
    const primaryCode = (languageToSpeechCode[language] || languageToSpeechCode.en)[0];
    return v.lang === primaryCode;
  });

  const otherVoices = currentLanguageVoices.filter(v => {
    const primaryCode = (languageToSpeechCode[language] || languageToSpeechCode.en)[0];
    return v.lang !== primaryCode;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Compact navbar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-2 rounded-lg transition ${
          isSpeaking
            ? 'bg-carolina-400 text-navy-900'
            : 'hover:bg-navy-700 text-white'
        }`}
        aria-label={isOpen ? 'Close text-to-speech' : 'Open text-to-speech'}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Text-to-Speech (⌘+Shift+S)"
      >
        {isSpeaking ? (
          <Volume2 className="w-4 h-4 animate-pulse" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Text-to-speech controls"
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="bg-navy-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span className="font-semibold text-sm">Text-to-Speech</span>
            </div>
            <span className="text-xs bg-navy-600 px-2 py-0.5 rounded">
              {languageNames[language]}
            </span>
          </div>

          {/* Controls */}
          <div className="p-3 space-y-3">
            {/* Main control buttons */}
            <div className="flex justify-center gap-2">
              {!isSpeaking ? (
                <button
                  onClick={startReading}
                  className="flex items-center gap-1.5 bg-navy-600 text-white px-3 py-2 rounded-lg hover:bg-navy-700 transition text-sm font-medium"
                  aria-label="Start reading page content"
                >
                  <Play className="w-4 h-4" />
                  Read Page
                </button>
              ) : (
                <>
                  <button
                    onClick={togglePause}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition text-sm font-medium ${
                      isPaused
                        ? 'bg-navy-600 text-white hover:bg-navy-700'
                        : 'bg-carolina-400 text-navy-900 hover:bg-carolina-300'
                    }`}
                    aria-label={isPaused ? 'Resume reading' : 'Pause reading'}
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={stopReading}
                    className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    aria-label="Stop reading"
                  >
                    <Square className="w-3 h-3" />
                    Stop
                  </button>
                </>
              )}
            </div>

            {/* Status indicator */}
            {isSpeaking && (
              <div
                className="text-center text-xs text-gray-500"
                role="status"
                aria-live="polite"
              >
                {isPaused ? 'Paused' : 'Reading aloud...'}
              </div>
            )}

            {/* Settings toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-700 text-xs py-1.5 border-t"
              aria-expanded={showSettings}
            >
              <Settings className="w-3 h-3" />
              {showSettings ? 'Hide Settings' : 'Settings'}
            </button>

            {/* Settings */}
            {showSettings && (
              <div className="space-y-2 pt-2 border-t">
                {/* Voice selection */}
                <div>
                  <label htmlFor="tts-voice" className="block text-xs font-medium text-gray-600 mb-1">
                    Voice ({languageNames[language]}) {isSpeaking && <span className="text-orange-500">(stop to change)</span>}
                  </label>
                  <select
                    id="tts-voice"
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const voice = voices.find(v => v.name === e.target.value);
                      setSelectedVoice(voice);
                    }}
                    disabled={isSpeaking}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-navy-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Select voice"
                  >
                    {currentLanguageVoices.length === 0 ? (
                      <option value="">No voices available for {languageNames[language]}</option>
                    ) : (
                      <>
                        {primaryVoices.length > 0 && (
                          <optgroup label={`${languageNames[language]} (Primary)`}>
                            {primaryVoices.map((voice) => (
                              <option key={voice.name} value={voice.name}>
                                {voice.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {otherVoices.length > 0 && (
                          <optgroup label={`${languageNames[language]} (Other)`}>
                            {otherVoices.map((voice) => (
                              <option key={voice.name} value={voice.name}>
                                {voice.name} ({voice.lang})
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </>
                    )}
                  </select>
                  {currentLanguageVoices.length === 0 && (
                    <p className="text-[10px] text-orange-500 mt-1">
                      Your browser may not have {languageNames[language]} voices installed.
                    </p>
                  )}
                </div>

                {/* Speed control */}
                <div>
                  <label htmlFor="tts-speed" className="block text-xs font-medium text-gray-600 mb-1">
                    Speed: {rate.toFixed(1)}x {isSpeaking && <span className="text-orange-500">(stop to change)</span>}
                  </label>
                  <input
                    id="tts-speed"
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.05"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    disabled={isSpeaking}
                    className="w-full accent-navy-600 h-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Reading speed"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
              </div>
            )}

            {/* Keyboard shortcut hint */}
            <div className="text-[10px] text-gray-400 text-center pt-1 border-t">
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">⌘/Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Shift</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">S</kbd> to read/stop
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
