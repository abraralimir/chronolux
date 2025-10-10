'use client';

import { useState, useEffect, useRef } from 'react';

type ClockProps = {
  tagline: string;
};

const Clock = ({ tagline }: ClockProps) => {
  const [time, setTime] = useState(new Date());
  const frameId = useRef<number>();

  useEffect(() => {
    // Set the initial time on the client to avoid hydration mismatch
    setTime(new Date());
    
    const animate = () => {
      setTime(new Date());
      frameId.current = requestAnimationFrame(animate);
    };

    frameId.current = requestAnimationFrame(animate);

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6 + milliseconds * 0.006;

  const renderHourMarkers = () => {
    const markers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = i * 30;
      const isMajor = i % 3 === 0;
      markers.push(
        <line
          key={i}
          x1="50"
          y1={isMajor ? "6" : "8"}
          x2="50"
          y2={isMajor ? "14" : "12"}
          stroke="hsl(var(--accent))"
          strokeWidth={isMajor ? "1.5" : "0.75"}
          transform={`rotate(${angle} 50 50)`}
        />
      );
    }
    return markers;
  };
  
    const renderMinuteMarkers = () => {
    const markers = [];
    for (let i = 1; i <= 60; i++) {
        if(i % 5 === 0) continue;
      const angle = i * 6;
      markers.push(
        <line
          key={i}
          x1="50"
          y1="8"
          x2="50"
          y2="9"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="0.5"
          transform={`rotate(${angle} 50 50)`}
        />
      );
    }
    return markers;
  };

  return (
    <div className="h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {/* Clock Face */}
        <circle cx="50" cy="50" r="48" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
        <circle cx="50" cy="50" r="46" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="0.5" />
        
        {/* Logo */}
        <text x="50" y="35" textAnchor="middle" fontSize="3" fill="hsl(var(--foreground))" className="font-headline tracking-wider">
          {tagline}
        </text>

        {/* Markers */}
        {renderHourMarkers()}
        {renderMinuteMarkers()}

        {/* Hands */}
        {/* Hour Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="28"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 50 50)`}
        />
        {/* Minute Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="18"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${minuteDeg} 50 50)`}
        />
        {/* Second Hand */}
        <line
          x1="50"
          y1="52"
          x2="50"
          y2="10"
          stroke="hsl(var(--primary))"
          strokeWidth="0.75"
          transform={`rotate(${secondDeg} 50 50)`}
        />
         <line
          x1="50"
          y1="50"
          x2="50"
          y2="60"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${secondDeg} 50 50)`}
        />
        
        {/* Center Pin */}
        <circle cx="50" cy="50" r="2.5" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
        <circle cx="50" cy="50" r="1" fill="hsl(var(--primary))" />
      </svg>
    </div>
  );
};

export default Clock;
