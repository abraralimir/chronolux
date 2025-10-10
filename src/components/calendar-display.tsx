'use client';

import { useState, useEffect } from 'react';

const CalendarDisplay = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60000); // Update every minute

    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dayOfMonth = date.getDate();

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-[18%] flex items-center space-x-2 bg-background border border-muted-foreground p-1 px-2 rounded-sm text-center">
        <p className="text-xs font-semibold text-foreground tracking-widest">{day.substring(0,3)}</p>
        <p className="text-xs font-semibold text-foreground">{dayOfMonth}</p>
    </div>
  );
};

export default CalendarDisplay;
