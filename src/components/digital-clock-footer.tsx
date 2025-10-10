'use client';

import { useState, useEffect } from 'react';

const DigitalClockFooter = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <footer className="w-full py-4 px-8 text-center text-foreground">
      <p className="text-2xl font-mono tracking-widest">{formattedTime}</p>
    </footer>
  );
};

export default DigitalClockFooter;
