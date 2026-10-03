import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Battery, Signal, X, MoreVertical } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { deviceMode, setDeviceMode } = useApp();

  if (deviceMode === 'responsive') {
    return <div className="w-full min-h-screen bg-[#0b0d19]">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-[#07080f] py-4 px-2 sm:py-8 flex flex-col items-center justify-start overflow-y-auto">
      {/* Device Mode Floating Control */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[430px] px-2 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#34d0a0] animate-ping" />
          <span className="font-semibold text-white">Telegram Mini App simulyatori</span>
        </div>
        <button
          onClick={() => setDeviceMode('responsive')}
          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-[11px] cursor-pointer"
        >
          Keng ekranga qaytish
        </button>
      </div>

      {/* Phone Mockup Frame */}
      <div className="relative w-full max-w-[414px] h-[860px] max-h-[92vh] rounded-[48px] border-[10px] border-[#22253c] shadow-2xl bg-[#0b0d19] flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#000000] rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#12162a]/80" />
        </div>

        {/* Telegram Top Status Bar */}
        <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-white/80 bg-[#0e1124] shrink-0 select-none z-40">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-white/70" />
            <Wifi className="w-3 h-3 text-white/70" />
            <Battery className="w-4 h-4 text-white/70" />
          </div>
        </div>

        {/* Telegram Mini App Header Bar */}
        <div className="h-11 px-4 flex items-center justify-between bg-[#12162a] border-b border-white/10 text-white shrink-0 z-40">
          <button
            onClick={() => setDeviceMode('responsive')}
            className="text-xs text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Yopish</span>
          </button>
          <div className="text-center">
            <div className="text-xs font-bold tracking-tight text-white">EduGo Bot</div>
            <div className="text-[10px] text-white/50">mini app</div>
          </div>
          <button className="text-white/60 hover:text-white cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Mini App Inner Canvas */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0b0d19] pb-20">
          {children}
        </div>
      </div>
    </div>
  );
};
