'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const achievements = [
  {
    id: 1,
    title: "First Check-in",
    description: "Complete your first health check-in",
    icon: "🏆",
    completed: true,
    progress: 100,
    date: "2 weeks ago"
  },
  {
    id: 2,
    title: "Consistency Champion",
    description: "Complete 7 consecutive days of check-ins",
    icon: "🔥",
    completed: true,
    progress: 100,
    date: "3 days ago"
  },
  {
    id: 3,
    title: "Detail Oriented",
    description: "Fill out all optional fields in a check-in",
    icon: "🔍",
    completed: true,
    progress: 100,
    date: "5 days ago"
  },
  {
    id: 4,
    title: "Sleep Tracker",
    description: "Log sleep data for 5 consecutive days",
    icon: "😴",
    completed: false,
    progress: 60,
    date: null
  },
  {
    id: 5,
    title: "Mood Master",
    description: "Track your mood for 14 consecutive days",
    icon: "😊",
    completed: false,
    progress: 50,
    date: null
  }
];

export function AchievementList() {
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);
  
  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <div 
          key={achievement.id}
          onClick={() => setSelectedAchievement(selectedAchievement === achievement.id ? null : achievement.id)}
          className={cn(
            "p-4 rounded-lg transition-all cursor-pointer border",
            selectedAchievement === achievement.id ? "bg-secondary/70 border-primary" : "bg-secondary/30 border-transparent hover:bg-secondary/50"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full text-xl">
              {achievement.icon}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{achievement.title}</h3>
                {achievement.completed ? (
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </span>
                ) : (
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full">
                    In Progress
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
          
          {!achievement.completed && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium">{achievement.progress}%</span>
              </div>
              <Progress value={achievement.progress} className="h-1.5" />
            </div>
          )}
          
          {selectedAchievement === achievement.id && (
            <div className="mt-4 pt-4 border-t border-border text-sm">
              {achievement.completed ? (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Earned</span>
                  <span>{achievement.date}</span>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Keep going! Complete the requirements to earn this achievement.
                </p>
              )}
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Reward</span>
                <span>+50 XP</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}