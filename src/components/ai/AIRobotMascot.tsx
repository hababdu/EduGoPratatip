import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { askAiApi } from '../../services/api';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Zap,
  RotateCcw,
  Volume2,
  ChevronDown,
  Minimize2,
  Maximize2,
  Move,
  Flame,
} from 'lucide-react';

type RobotMood = 'idle' | 'wave' | 'thinking' | 'celebrate' | 'sleep';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

const PRESET_TIPS = [
  "Salom! Men EduBot — sizning sun'iy intellekt ta'lim yordamchingizman. Meni ekranning istalgan joyiga surishingiz mumkin!",
  "Bugungi kunlik streak ko'rsatkichingiz ajoyib! Yana 1 ta dars ko'rsangiz +50 XP olasiz.",
  "Eslatma: DTM Matematika va Frontend TMA bo'yicha yangi haftalik testlar ochildi.",
  "Miya qobiliyatini oshirish uchun 25 daqiqa o'qib, 5 daqiqa dam olish (Pomodoro) tavsiya etiladi!",
  "Savolingiz bormi? Menga bosing, mavzularni birgalikda tahlil qilamiz!",
];

const KNOWLEDGE_BASE: Record<string, string> = {
  react: "React 19 da `useActionState`, `useOptimistic` hamda to'g'ridan-to'g'ri resurslarni o'qish uchun `use()` hooklari qo'shildi. Shu bilan birga server actions va form boshqaruvi ancha soddalashdi.",
  ielts: "IELTS Reading'da eng muhim qoida — Skimming (umumiy ma'no) va Scanning (aniq kalit so'zlarni topish). Har bir savolga 1.5 daqiqadan ko'p sarflamang!",
  dtm: "DTM testlarida vaqt taqsimoti hal qiluvchi ahamiyatga ega: oson savollarni birinchi 20 daqiqada yechib, murakkab masalalarga ko'proq vaqt ajrating.",
  motivatsiya: "Kichik qadamlar buyuk natijalarga olib keladi. Har kuni o'rganilgan bitta yangi tushuncha bir yilda 365 ta ustunlik beradi! Siz uddalaysiz! 🔥",
  test: "Savol: Telegram WebApp'da foydalanuvchi ma'lumotlarini backendda tekshirish uchun qaysi parametr tekshiriladi? Javob: initData (HMAC-SHA256 hash orqali)!",
};

export const AIRobotMascot: React.FC = () => {
  const { currentUser, fireConfetti, showToast } = useApp();

  const [mood, setMood] = useState<RobotMood>('idle');
  const [chatOpen, setChatOpen] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(
    "Salom! Meni ekranning istalgan joyiga surishingiz mumkin 🤖"
  );
  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Salom, ${currentUser.name}! Men EduGo AI yordamchisiman. Darslar, testlar, qiyin mavzular yoki o'qish rejangiz bo'yicha savol bering!`,
      time: 'Hozir',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-hide initial speech bubble after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeechBubbleText(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  // Handle preset action animations
  const triggerMood = (newMood: RobotMood, customBubble?: string) => {
    setMood(newMood);
    if (customBubble) {
      setSpeechBubbleText(customBubble);
    }

    if (newMood === 'celebrate') {
      fireConfetti();
    }

    if (newMood !== 'sleep') {
      setTimeout(() => {
        setMood('idle');
      }, 4500);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuestion;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      time: 'Hozir',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');

    // Robot enters thinking animation
    setMood('thinking');

    askAiApi(q).then((res) => {
      let reply = res?.answer;
      if (!reply) {
        const lowerQ = q.toLowerCase();
        reply = "Ajoyib savol! EduGo platformasida ushbu mavzu bo'yicha maxsus video darslar va amaliy testlar tayyorlangan. Qaysi bo'limdan boshlashni xohlaysiz?";

        if (lowerQ.includes('react') || lowerQ.includes('frontend') || lowerQ.includes('tma') || lowerQ.includes('mini app')) {
          reply = KNOWLEDGE_BASE.react;
        } else if (lowerQ.includes('ielts') || lowerQ.includes('ingliz') || lowerQ.includes('reading')) {
          reply = KNOWLEDGE_BASE.ielts;
        } else if (lowerQ.includes('matematika') || lowerQ.includes('dtm') || lowerQ.includes('hosila')) {
          reply = KNOWLEDGE_BASE.dtm;
        } else if (lowerQ.includes('motivatsiya') || lowerQ.includes('charchadim') || lowerQ.includes('ilhom')) {
          reply = KNOWLEDGE_BASE.motivatsiya;
        } else if (lowerQ.includes('test') || lowerQ.includes('savol') || lowerQ.includes('viktorina')) {
          reply = KNOWLEDGE_BASE.test;
        }
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: 'Hozir',
      };

      setMessages((prev) => [...prev, botMsg]);
      setMood('celebrate');
      setTimeout(() => setMood('idle'), 2500);
    });
  };

  // Robot animations depending on mood
  const robotVariants = {
    idle: {
      y: [0, -8, 0],
      rotate: [-1.5, 1.5, -1.5],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut' as const,
      },
    },
    wave: {
      y: [0, -4, 0],
      rotate: [-8, 8, -8, 8, 0],
      transition: {
        duration: 1.2,
        repeat: 2,
        ease: 'easeInOut' as const,
      },
    },
    thinking: {
      y: [-2, -2],
      rotate: [0, -6, 6, -3, 0],
      scale: [1, 1.04, 1],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut' as const,
      },
    },
    celebrate: {
      y: [0, -22, 0, -15, 0],
      scale: [1, 1.15, 1, 1.08, 1],
      rotate: [0, -8, 8, -4, 0],
      transition: {
        duration: 1.2,
        repeat: 2,
        ease: 'easeOut' as const,
      },
    },
    sleep: {
      y: [0, 4, 0],
      rotate: [5, 8, 5],
      transition: {
        repeat: Infinity,
        duration: 4,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <>
      {/* Draggable Robot Mascot Container */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        className="fixed z-50 cursor-grab active:cursor-grabbing select-none touch-none"
        style={{
          bottom: '85px',
          right: '20px',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="relative flex flex-col items-center">
          {/* Speech Bubble */}
          <AnimatePresence>
            {speechBubbleText && !chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.8 }}
                className="absolute bottom-full mb-3 right-0 w-52 sm:w-60 p-3 rounded-2xl bg-[#161a33]/95 border border-[#ffb020]/40 text-white text-xs shadow-2xl backdrop-blur-md pointer-events-auto"
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] leading-relaxed text-white/90">
                    {speechBubbleText}
                  </p>
                  <button
                    onClick={() => setSpeechBubbleText(null)}
                    className="text-white/40 hover:text-white cursor-pointer -mr-1 -mt-1 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Speech arrow */}
                <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#161a33] border-b border-r border-[#ffb020]/40 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Robot Character Graphic */}
          <motion.div
            variants={robotVariants}
            animate={mood}
            onClick={() => {
              if (mood === 'sleep') {
                triggerMood('wave', "Uyg'ondim! Qanday yordam bera olaman? 😊");
              } else {
                setChatOpen(!chatOpen);
              }
            }}
            className="group relative flex flex-col items-center cursor-pointer"
          >
            {/* Sleeping ZZZ particles */}
            {mood === 'sleep' && (
              <div className="absolute -top-6 -right-2 text-xs font-bold text-[#38bdf8] flex flex-col animate-bounce">
                <span className="text-[10px]">z</span>
                <span className="text-xs ml-1">Z</span>
                <span className="text-sm ml-2">Z</span>
              </div>
            )}

            {/* Antenna with pulsing orb */}
            <div className="w-1.5 h-3 bg-gradient-to-t from-slate-400 to-[#ffb020] rounded-t-full relative">
              <span
                className={`absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${
                  mood === 'celebrate'
                    ? 'bg-[#34d0a0] shadow-md shadow-[#34d0a0]'
                    : mood === 'thinking'
                    ? 'bg-[#38bdf8] shadow-md shadow-[#38bdf8] animate-ping'
                    : 'bg-[#ffb020] shadow-md shadow-[#ffb020]/60 animate-pulse'
                }`}
              />
            </div>

            {/* Robot Head */}
            <div className="relative w-14 h-12 rounded-2xl bg-gradient-to-b from-[#2a3055] via-[#1c213d] to-[#12162a] border-2 border-white/20 shadow-xl flex items-center justify-center overflow-hidden">
              {/* Ear Sensors */}
              <span className="absolute -left-1 w-1.5 h-4 rounded-l-md bg-[#ffb020]/70" />
              <span className="absolute -right-1 w-1.5 h-4 rounded-r-md bg-[#ffb020]/70" />

              {/* Visor Display Screen */}
              <div className="w-11 h-8 rounded-xl bg-[#090b14] border border-cyan-500/30 flex items-center justify-center gap-2 relative shadow-inner">
                {/* Glowing Eyes according to mood */}
                {mood === 'idle' && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34d0a0] shadow-[0_0_8px_#34d0a0]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34d0a0] shadow-[0_0_8px_#34d0a0]" />
                  </>
                )}

                {mood === 'wave' && (
                  <>
                    <span className="text-xs font-black text-[#ffb020] leading-none">^</span>
                    <span className="text-xs font-black text-[#ffb020] leading-none">^</span>
                  </>
                )}

                {mood === 'thinking' && (
                  <>
                    <motion.span
                      animate={{ x: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"
                    />
                    <motion.span
                      animate={{ x: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"
                    />
                  </>
                )}

                {mood === 'celebrate' && (
                  <>
                    <span className="text-[11px] text-[#ffb020] animate-spin">★</span>
                    <span className="text-[11px] text-[#ffb020] animate-spin">★</span>
                  </>
                )}

                {mood === 'sleep' && (
                  <>
                    <span className="w-2.5 h-0.5 bg-white/40 rounded-full" />
                    <span className="w-2.5 h-0.5 bg-white/40 rounded-full" />
                  </>
                )}
              </div>
            </div>

            {/* Robot Neck & Floating Torso */}
            <div className="w-4 h-1.5 bg-slate-500 rounded-sm -mt-0.5" />

            <div className="relative w-12 h-10 rounded-2xl bg-gradient-to-b from-[#222749] to-[#141730] border border-white/20 shadow-lg flex items-center justify-center">
              {/* Left Hover Arm (waves during mood === 'wave') */}
              <motion.div
                animate={
                  mood === 'wave'
                    ? { rotate: [-20, 50, -20], y: [-2, -6, -2] }
                    : { rotate: 0 }
                }
                transition={{ duration: 0.5, repeat: mood === 'wave' ? 4 : 0 }}
                className="absolute -left-2 top-1.5 w-2 h-5 rounded-full bg-slate-400 border border-white/20 origin-top"
              />

              {/* Right Hover Arm */}
              <div className="absolute -right-2 top-1.5 w-2 h-5 rounded-full bg-slate-400 border border-white/20 origin-top" />

              {/* Reactor Core Chest Light */}
              <div className="w-5 h-5 rounded-xl bg-[#ffb020]/20 border border-[#ffb020]/50 flex items-center justify-center">
                <span className="text-[9px] font-black text-[#ffb020]">EG</span>
              </div>
            </div>

            {/* Hover Jet Glow */}
            <motion.div
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.9, 1.15, 0.9],
              }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-6 h-2 rounded-full bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent blur-[2px] mt-0.5"
            />
          </motion.div>

          {/* Quick Drag & Mood Pill Badge below mascot */}
          <div className="mt-1 flex items-center gap-1 bg-[#12162a]/90 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[9px] text-white/60 shadow-lg">
            <Move className="w-2.5 h-2.5 text-[#ffb020]" />
            <span>EduBot</span>
          </div>
        </div>
      </motion.div>

      {/* Expandable AI Assistant Dialog Modal */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-h-[520px] rounded-3xl border border-white/15 bg-[#12162a]/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#1c2247] to-[#141833] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#ffb020] text-[#0b0d19] flex items-center justify-center font-bold text-xs shadow-md shadow-[#ffb020]/20">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    EduBot AI Yordamchi
                    <span className="w-2 h-2 rounded-full bg-[#34d0a0] animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-white/50">Aqlli ta'lim va konsultatsiya agenti</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Animation Tester Bar */}
            <div className="px-3 py-2 bg-white/5 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
              <span className="text-white/40 text-[9px] shrink-0">Harakatlar:</span>
              <button
                onClick={() => triggerMood('wave', 'Salom do\'stim! Yaxshi o\'qiyapsizmi? 👋')}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 shrink-0 cursor-pointer"
              >
                👋 Salomlash
              </button>
              <button
                onClick={() => triggerMood('thinking', 'O\'ylayapman... Savolingizni tahlil qilmoqdaman 🤔')}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 shrink-0 cursor-pointer"
              >
                🤔 O'ylash
              </button>
              <button
                onClick={() => triggerMood('celebrate', 'Yashang! Ajoyib muvaffaqiyat! 🎉')}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#ffb020] font-bold shrink-0 cursor-pointer"
              >
                🎉 Sakrash
              </button>
              <button
                onClick={() => triggerMood('sleep', 'Biroz dam olib olaman... zZz 😴')}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#38bdf8] shrink-0 cursor-pointer"
              >
                😴 Uxlatish
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto max-h-[300px] text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed text-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#ffb020] text-[#0b0d19] font-medium rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-white/30 px-1 mt-0.5">
                    {msg.time}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5">
              {[
                'React 19 yangiliklari',
                'IELTS Reading sirlari',
                'Motivatsiya ber!',
                'Tezkor test savoli',
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-[10px] whitespace-nowrap transition cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-[#0d1021] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="EduBot'ga savol bering..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ffb020]"
                />
                <button
                  type="submit"
                  disabled={!inputQuestion.trim()}
                  className="p-2 rounded-xl bg-[#ffb020] hover:bg-[#e69e1c] disabled:opacity-40 text-[#0b0d19] transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
