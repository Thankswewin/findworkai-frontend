import React from 'react'
import { cn } from '@/lib/utils'

interface IPhoneFrameProps {
  children: React.ReactNode
  className?: string
  variant?: 'pro' | 'pro-max'
  color?: 'natural' | 'blue' | 'white' | 'black'
  showStatusBar?: boolean
  showDynamicIsland?: boolean
}

export function IPhoneFrame({
  children,
  className,
  variant = 'pro',
  color = 'black',
  showStatusBar = true,
  showDynamicIsland = true
}: IPhoneFrameProps) {
  const frameColors = {
    natural: 'bg-gradient-to-b from-gray-300 to-gray-400',
    blue: 'bg-gradient-to-b from-blue-800 to-blue-900',
    white: 'bg-gradient-to-b from-gray-100 to-gray-200',
    black: 'bg-gradient-to-b from-gray-900 to-black'
  }

  const screenSize = variant === 'pro-max' ? 'w-[428px] h-[926px]' : 'w-[393px] h-[852px]'

  return (
    <div className={cn("relative inline-block", className)}>
      {/* iPhone Frame */}
      <div className={cn(
        "relative rounded-[60px] p-[12px] shadow-2xl",
        frameColors[color],
        "before:absolute before:inset-[8px] before:rounded-[52px] before:bg-black",
        "after:absolute after:inset-0 after:rounded-[60px] after:shadow-inner after:pointer-events-none",
        "after:bg-gradient-to-br after:from-white/10 after:to-transparent"
      )}>
        {/* Side Buttons */}
        {/* Power Button */}
        <div className="absolute -right-[3px] top-[180px] w-[3px] h-[100px] bg-inherit rounded-r-lg shadow-lg" />
        
        {/* Volume Buttons */}
        <div className="absolute -left-[3px] top-[140px] w-[3px] h-[60px] bg-inherit rounded-l-lg shadow-lg" />
        <div className="absolute -left-[3px] top-[210px] w-[3px] h-[60px] bg-inherit rounded-l-lg shadow-lg" />
        
        {/* Silent Switch */}
        <div className="absolute -left-[3px] top-[90px] w-[3px] h-[30px] bg-inherit rounded-l-lg shadow-lg" />

        {/* Screen Container */}
        <div className={cn(
          "relative bg-black rounded-[44px] overflow-hidden",
          screenSize,
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
        )}>
          {/* Dynamic Island */}
          {showDynamicIsland && (
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-50">
              <div className="relative">
                {/* Main pill shape */}
                <div className="w-[126px] h-[37px] bg-black rounded-full shadow-lg" />
                
                {/* Animated expansion effect */}
                <div className="absolute inset-0 w-[126px] h-[37px] bg-black rounded-full animate-pulse opacity-50" />
                
                {/* Camera and sensors simulation */}
                <div className="absolute top-[11px] left-[20px] w-[14px] h-[14px] bg-gray-900 rounded-full">
                  <div className="absolute inset-[2px] bg-gray-800 rounded-full">
                    <div className="absolute inset-[2px] bg-blue-900 rounded-full animate-pulse" />
                  </div>
                </div>
                
                {/* Speaker grill */}
                <div className="absolute top-[16px] right-[25px] w-[40px] h-[6px] bg-gray-900 rounded-full" />
              </div>
            </div>
          )}

          {/* Status Bar */}
          {showStatusBar && (
            <div className="absolute top-0 left-0 right-0 h-[54px] bg-gradient-to-b from-black/50 to-transparent z-40">
              <div className="flex justify-between items-center px-8 pt-3 text-white text-[14px] font-medium">
                {/* Time */}
                <div className="min-w-[54px]">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </div>
                
                {/* Right icons */}
                <div className="flex items-center gap-1">
                  {/* Signal */}
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
                    <rect x="0" y="7" width="3" height="5" rx="0.5" />
                    <rect x="5" y="5" width="3" height="7" rx="0.5" />
                    <rect x="10" y="3" width="3" height="9" rx="0.5" />
                    <rect x="15" y="0" width="3" height="12" rx="0.5" opacity="0.4" />
                  </svg>
                  
                  {/* WiFi */}
                  <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor">
                    <path d="M7.5 10.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3.5-3c0-.55.2-1.05.59-1.41C5.05 5.65 6.22 5.5 7.5 5.5s2.45.15 2.91.59c.39.36.59.86.59 1.41l-1.5 1.5c-.15-.15-.35-.25-.59-.29-.41-.08-.91-.21-1.41-.21s-1 .13-1.41.21c-.24.04-.44.14-.59.29L4 7.5zm-3-3c0-.55.2-1.05.59-1.41C2.55 2.65 4.72 2 7.5 2s4.95.65 5.91 1.59c.39.36.59.86.59 1.41L12 6c-.15-.15-.35-.25-.59-.29C10.59 5.13 9.09 4.5 7.5 4.5S4.41 5.13 3.59 5.71c-.24.04-.44.14-.59.29L1 4.5z" />
                  </svg>
                  
                  {/* Battery */}
                  <div className="flex items-center">
                    <div className="w-[25px] h-[12px] border border-white/60 rounded-[3px] relative">
                      <div className="absolute inset-[1px] w-[70%] bg-white rounded-[2px]" />
                    </div>
                    <div className="w-[1.5px] h-[4px] bg-white/60 rounded-r-[1px] -ml-[0.5px]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Screen Content */}
          <div className="absolute inset-0 overflow-auto">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-white rounded-full opacity-60" />
        </div>
      </div>

      {/* Reflection Effect */}
      <div className="absolute inset-0 rounded-[60px] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Shadow */}
      <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-2xl rounded-full" />
    </div>
  )
}

// Optional: Animated iPhone that tilts on hover
export function AnimatedIPhoneFrame(props: IPhoneFrameProps) {
  return (
    <div className="group perspective-1000">
      <div className="transition-transform duration-500 transform-gpu group-hover:rotate-y-12 group-hover:-rotate-x-6">
        <IPhoneFrame {...props} />
      </div>
    </div>
  )
}
