'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export function StreakCalendar() {
  // Generate the last 35 days for the calendar (5 weeks)
  const getDaysArray = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 34; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push({
        date,
        formattedDate: date.getDate(),
        isCurrentMonth: date.getMonth() === today.getMonth(),
        isToday: i === 0,
        hasCheckIn: Math.random() > 0.3 && i !== 0, // Randomly mark some days as checked in, except today
      });
    }
    
    return days;
  };
  
  const days = getDaysArray();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Group days into weeks
  const weeks = [];
  let currentWeek = [];
  
  days.forEach((day, index) => {
    currentWeek.push(day);
    if (index % 7 === 6 || index === days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  return (
    <div className="p-6">
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map((weekday) => (
          <div key={weekday} className="text-center text-xs font-medium text-muted-foreground">
            {weekday}
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => {
              const dayKey = `${weekIndex}-${dayIndex}`;
              return (
                <div 
                  key={dayKey} 
                  className={cn(
                    "h-10 rounded-md flex items-center justify-center relative",
                    day.isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                    day.isToday && "border-2 border-primary",
                    day.hasCheckIn && "bg-primary/10"
                  )}
                >
                  <span className="text-xs">{day.formattedDate}</span>
                  {day.hasCheckIn && (
                    <CheckCircle2 className="absolute bottom-0.5 right-0.5 h-3 w-3 text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}